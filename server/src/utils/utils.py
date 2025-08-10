from flask import jsonify, session
from functools import wraps
from datetime import datetime, timezone
import uuid
import logging
from sqlalchemy import and_

from db.db import db
from models.models import Notification, Users, Todo, Reminder, Chore, History
from models.types import ItemType, EventType, NotificationSeverity, EventType, NotificationType


def login_required(function_to_protect):
    @wraps(function_to_protect)
    def wrapper(*args, **kwargs):
        user_id = session.get('user_id')
        if user_id:
            user = Users.query.filter_by(id=user_id).first()
            if user:
                # Success!
                return function_to_protect(user, *args, **kwargs)
            else:
                return jsonify({"error": "Invalid user"}), 401
        else:
            return jsonify({"error": "Unauthorized"}), 401
    return wrapper


def log_history_event(
        event_type: EventType,
        item,
        item_type: str,
        user_id: str,
        house_id: str):
    """Log an event to the history table"""
    try:
        history_entry = History(
            id=str(uuid.uuid4()),
            event_type=event_type,
            item_id=item.id if hasattr(item, 'id') else '',
            item_data=item.data if hasattr(item, 'data') else '',
            item_type=item_type,
            user_id=user_id,
            house_id=house_id,
            created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        history_entry.set_item(item)
        db.session.add(history_entry)
        db.session.commit()
    except Exception as e:
        print(f"Error logging history event: {e}")
        db.session.rollback()


def check_reminders():
    all_reminders = Reminder.query.all()
    count_added_notifications = 0

    for reminder in all_reminders:
        # Skip reminders without a deadline
        if not reminder.deadline or reminder.deadline.strip() == '':
            continue

        # Parse the ISO format deadline string to datetime object
        reminder_deadline = datetime.fromisoformat(
            reminder.deadline.replace('Z', '+00:00'))
        # Ensure reminder_deadline is timezone-aware
        if reminder_deadline.tzinfo is None:
            reminder_deadline = reminder_deadline.replace(tzinfo=timezone.utc)
        if reminder_deadline < datetime.now(timezone.utc):
            # Check if notification already exists for this reminder
            existing_notification = Notification.query.filter(
                and_(
                    Notification.item_type == ItemType.REMINDER,
                    Notification.item_id == reminder.id,
                    Notification.user_id == reminder.user_id,
                    Notification.item_iteration_count == reminder.iteration_count,
                )
            ).first()

            if not existing_notification:
                # Send a notification for the expired reminder
                count_added_notifications += 1
                notification = Notification(
                    id=str(uuid.uuid4()),
                    notification_type=NotificationType.ITEM_DUE,
                    item_type=ItemType.REMINDER,
                    item_id=reminder.id,
                    item_iteration_count=reminder.iteration_count,
                    name=f"{reminder.data}",
                    description=f"The reminder '{reminder.data}' has expired.",
                    severity=NotificationSeverity.INFO,
                    is_viewed=False,
                    is_removed=False,
                    created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    href=f"/home/reminders",
                    user_id=reminder.user_id,
                )
                db.session.add(notification)
    db.session.commit()
    logging.info(
        f"Added {count_added_notifications} notifications for expired reminders.")


def check_chores():
    all_chores = Chore.query.all()
    count_added_notifications = 0
    for chore in all_chores:
        # Skip chores without a deadline
        if not chore.deadline or chore.deadline.strip() == '':
            continue

        # Parse the ISO format deadline string to datetime object
        chore_deadline = datetime.fromisoformat(
            chore.deadline.replace('Z', '+00:00'))
        # Ensure chore_deadline is timezone-aware
        if chore_deadline.tzinfo is None:
            chore_deadline = chore_deadline.replace(tzinfo=timezone.utc)
        if chore_deadline < datetime.now(timezone.utc):
            # Get all users assigned to this house
            house_users = Users.query.filter_by(house_id=chore.house_id).all()

            for user in house_users:
                # Check if notification already exists for this chore and user
                existing_notification = Notification.query.filter(
                    and_(
                        Notification.item_type == ItemType.CHORE,
                        Notification.item_id == chore.id,
                        Notification.user_id == user.id,
                        Notification.item_iteration_count == chore.iteration_count,
                    )
                ).first()

                if not existing_notification:
                    # Send a notification for the expired chore
                    count_added_notifications += 1
                    notification = Notification(
                        id=str(uuid.uuid4()),
                        notification_type=NotificationType.ITEM_DUE,
                        item_type=ItemType.CHORE,
                        item_id=chore.id,
                        item_iteration_count=chore.iteration_count,
                        name=f"{chore.data}",
                        description=f"The chore '{chore.data}' is due.",
                        severity=NotificationSeverity.INFO,
                        is_viewed=False,
                        is_removed=False,
                        created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        href=f"/home/chores",
                        user_id=user.id,
                    )
                    db.session.add(notification)
    db.session.commit()
    logging.info(
        f"Added {count_added_notifications} notifications for expired chores.")


def check_todos():
    all_todos = Todo.query.all()
    count_added_notifications = 0
    for todo in all_todos:
        # Skip todos without a deadline
        if not todo.deadline or todo.deadline.strip() == '':
            continue

        # Parse the ISO format deadline string to datetime object
        todo_deadline = datetime.fromisoformat(
            todo.deadline.replace('Z', '+00:00'))
        # Ensure todo_deadline is timezone-aware
        if todo_deadline.tzinfo is None:
            todo_deadline = todo_deadline.replace(tzinfo=timezone.utc)
        if todo_deadline < datetime.now(timezone.utc):
            # Get all users assigned to this house
            house_users = Users.query.filter_by(house_id=todo.house_id).all()

            for user in house_users:
                # Check if notification already exists for this todo and user
                existing_notification = Notification.query.filter(
                    and_(
                        Notification.item_type == ItemType.TODO,
                        Notification.item_id == todo.id,
                        Notification.user_id == user.id,
                    )
                ).first()

                if not existing_notification:
                    # Send a notification for the expired todo
                    count_added_notifications += 1
                    notification = Notification(
                        id=str(uuid.uuid4()),
                        notification_type=NotificationType.ITEM_DUE,
                        item_type=ItemType.TODO,
                        item_id=todo.id,
                        item_iteration_count=0,
                        name=f"{todo.data}",
                        description=f"The todo '{todo.data}' is due.",
                        severity=NotificationSeverity.INFO,
                        is_viewed=False,
                        is_removed=False,
                        created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        href=f"/home/todo",
                        user_id=user.id,
                    )
                    db.session.add(notification)
    db.session.commit()
    logging.info(
        f"Added {count_added_notifications} notifications for expired todos.")


def check_deadlines():
    logging.info("Checking deadlines for reminders, chores, and todos")
    check_reminders()
    check_chores()
    check_todos()
