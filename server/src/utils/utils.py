from flask import jsonify, session
from functools import wraps
from datetime import datetime, timezone
import json
import os
import uuid
import logging
from sqlalchemy import and_
from pywebpush import webpush, WebPushException

from db.db import db
from models.models import Notification, PushSubscription, Users, Todo, Reminder, Chore, History
from models.types import ItemType, EventType, NotificationSeverity, EventType, NotificationType
from utils.api_errors import AuthenticationError


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
                raise AuthenticationError("Invalid user")
        else:
            raise AuthenticationError()
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


def send_push_notification(user_id, title, body, href=None):
    """Send web push to all active subscriptions for a user.
    Non-blocking: logs errors but never raises."""
    logging.debug(
        f"[PUSH] send_push_notification called for user={user_id}, title='{title}'")

    vapid_private_key = os.environ.get("VAPID_PRIVATE_KEY")
    if not vapid_private_key:
        logging.warning("[PUSH] VAPID_PRIVATE_KEY not set — skipping push")
        return

    subscriptions = PushSubscription.query.filter_by(user_id=user_id).all()
    logging.debug(
        f"[PUSH] Found {len(subscriptions)} subscription(s) for user={user_id}")
    if not subscriptions:
        return

    payload = json.dumps({
        "title": title,
        "body": body,
        "href": href or "/",
        "icon": "/web-app-manifest-192x192.png"
    })

    for sub in subscriptions:
        logging.debug(
            f"[PUSH] Sending to subscription {sub.id}, endpoint={sub.endpoint[:80]}...")
        try:
            webpush(
                subscription_info={
                    "endpoint": sub.endpoint,
                    "keys": {
                        "p256dh": sub.p256dh_key,
                        "auth": sub.auth_key
                    }
                },
                data=payload,
                vapid_private_key=vapid_private_key,
                vapid_claims={"sub": "mailto:noreply@tidymate.app"}
            )
            logging.debug(f"[PUSH] Successfully sent to subscription {sub.id}")
        except WebPushException as e:
            logging.warning(
                f"[PUSH] WebPushException for subscription {sub.id}: {e}")
            if hasattr(e, 'response') and e.response is not None:
                logging.warning(
                    f"[PUSH] Response status: {e.response.status_code}, body: {e.response.text[:200]}")
                if e.response.status_code in (404, 410):
                    logging.info(
                        f"[PUSH] Removing expired subscription {sub.id}")
                    db.session.delete(sub)
                    db.session.commit()
        except Exception as e:
            logging.error(
                f"[PUSH] Unexpected error for subscription {sub.id}: {type(e).__name__}: {e}")


def _is_deadline_due(deadline_str):
    """Check if a deadline string is today or in the past."""
    if not deadline_str or deadline_str.strip() == '':
        return False
    try:
        deadline = datetime.fromisoformat(
            deadline_str.replace('Z', '+00:00'))
        if deadline.tzinfo is None:
            deadline = deadline.replace(tzinfo=timezone.utc)
        return deadline < datetime.now(timezone.utc)
    except (ValueError, TypeError):
        return False


def dismiss_notifications_for_item(item_id, item_type_enum):
    """Mark all active notifications for an item as removed."""
    notifications = Notification.query.filter(
        and_(
            Notification.item_id == item_id,
            Notification.item_type == item_type_enum,
            Notification.is_removed != True,
        )
    ).all()
    for n in notifications:
        n.is_removed = True
    if notifications:
        db.session.commit()
        logging.debug(
            f"Dismissed {len(notifications)} notification(s) for item {item_id}")


def _item_context(item):
    """Return room/category context string for an item, e.g. ' (Kitchen)'."""
    room = getattr(item, 'room', None)
    category = getattr(item, 'category', None)
    label = room or category
    if label and str(label).strip():
        return f" ({label})"
    return ""


def notify_if_due(item, item_type, item_type_enum, user_ids, href):
    """Create notifications + push for an item if its deadline is due.
    Called after item creation to give immediate feedback.
    user_ids: list of user IDs to notify."""
    if not _is_deadline_due(item.deadline):
        return

    iteration_count = getattr(item, 'iteration_count', 0) or 0
    context = _item_context(item)
    description = f"The {item_type} '{item.data}' is due.{context}"

    for user_id in user_ids:
        notification = Notification(
            id=str(uuid.uuid4()),
            notification_type=NotificationType.ITEM_DUE,
            item_type=item_type_enum,
            item_id=item.id,
            item_iteration_count=iteration_count,
            name=item.data,
            description=description,
            severity=NotificationSeverity.INFO,
            is_viewed=False,
            is_removed=False,
            created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            href=href,
            user_id=user_id,
        )
        db.session.add(notification)
    db.session.commit()

    for user_id in user_ids:
        send_push_notification(user_id, item.data, description, href)


def check_reminders():
    all_reminders = Reminder.query.all()
    count_added_notifications = 0
    pending_pushes = []

    for reminder in all_reminders:
        # Skip reminders without a deadline
        if not reminder.deadline or reminder.deadline.strip() == '':
            continue

        try:
            reminder_deadline = datetime.fromisoformat(
                reminder.deadline.replace('Z', '+00:00'))
            if reminder_deadline.tzinfo is None:
                reminder_deadline = reminder_deadline.replace(
                    tzinfo=timezone.utc)
        except (ValueError, TypeError) as e:
            logging.error(
                f"Error parsing deadline for reminder {reminder.id}: {e}")
            continue

        if reminder_deadline >= datetime.now(timezone.utc):
            continue

        iteration_count = reminder.iteration_count or 0

        existing_notification = Notification.query.filter(
            and_(
                Notification.item_type == ItemType.REMINDER,
                Notification.item_id == reminder.id,
                Notification.user_id == reminder.user_id,
                Notification.item_iteration_count == iteration_count,
                Notification.is_removed != True,
            )).first()

        if not existing_notification:
            count_added_notifications += 1
            context = _item_context(reminder)
            description = f"The reminder '{reminder.data}' has expired.{context}"
            notification = Notification(
                id=str(uuid.uuid4()),
                notification_type=NotificationType.ITEM_DUE,
                item_type=ItemType.REMINDER,
                item_id=reminder.id,
                item_iteration_count=iteration_count,
                name=f"{reminder.data}",
                description=description,
                severity=NotificationSeverity.INFO,
                is_viewed=False,
                is_removed=False,
                created_on=datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"),
                href=f"/home/reminders",
                user_id=reminder.user_id,
            )
            db.session.add(notification)
            pending_pushes.append((
                reminder.user_id, notification.name,
                notification.description, notification.href))

    db.session.commit()
    for user_id, title, body, href in pending_pushes:
        send_push_notification(user_id, title, body, href)
    logging.info(
        f"Added {count_added_notifications} notifications for expired reminders.")


def check_chores():
    all_chores = Chore.query.all()
    count_added_notifications = 0
    pending_pushes = []
    for chore in all_chores:
        # Skip chores without a deadline
        if not chore.deadline or chore.deadline.strip() == '':
            continue

        try:
            chore_deadline = datetime.fromisoformat(
                chore.deadline.replace('Z', '+00:00'))
            if chore_deadline.tzinfo is None:
                chore_deadline = chore_deadline.replace(tzinfo=timezone.utc)
        except (ValueError, TypeError) as e:
            logging.error(
                f"Error parsing deadline for chore {chore.id}: {e}")
            continue

        if chore_deadline >= datetime.now(timezone.utc):
            continue

        iteration_count = chore.iteration_count or 0

        # Notify assignee if set, otherwise all house members
        if chore.assignee and chore.assignee.strip():
            notify_users = Users.query.filter_by(id=chore.assignee).all()
        else:
            notify_users = Users.query.filter_by(
                house_id=chore.house_id).all()

        for user in notify_users:
            existing_notification = Notification.query.filter(
                and_(
                    Notification.item_type == ItemType.CHORE,
                    Notification.item_id == chore.id,
                    Notification.user_id == user.id,
                    Notification.item_iteration_count == iteration_count,
                    Notification.is_removed != True,
                )).first()

            if not existing_notification:
                count_added_notifications += 1
                context = _item_context(chore)
                description = f"The chore '{chore.data}' is due.{context}"
                notification = Notification(
                    id=str(uuid.uuid4()),
                    notification_type=NotificationType.ITEM_DUE,
                    item_type=ItemType.CHORE,
                    item_id=chore.id,
                    item_iteration_count=iteration_count,
                    name=f"{chore.data}",
                    description=description,
                    severity=NotificationSeverity.INFO,
                    is_viewed=False,
                    is_removed=False,
                    created_on=datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S"),
                    href=f"/home/chores",
                    user_id=user.id,
                )
                db.session.add(notification)
                pending_pushes.append((
                    user.id, notification.name,
                    notification.description, notification.href))

    db.session.commit()
    for user_id, title, body, href in pending_pushes:
        send_push_notification(user_id, title, body, href)
    logging.info(
        f"Added {count_added_notifications} notifications for expired chores.")


def check_todos():
    all_todos = Todo.query.all()
    count_added_notifications = 0
    pending_pushes = []
    for todo in all_todos:
        # Skip todos without a deadline or already done
        if not todo.deadline or todo.deadline.strip() == '':
            continue

        try:
            todo_deadline = datetime.fromisoformat(
                todo.deadline.replace('Z', '+00:00'))
            if todo_deadline.tzinfo is None:
                todo_deadline = todo_deadline.replace(tzinfo=timezone.utc)
        except (ValueError, TypeError) as e:
            logging.error(
                f"Error parsing deadline for todo {todo.id}: {e}")
            continue

        if todo_deadline >= datetime.now(timezone.utc):
            continue

        house_users = Users.query.filter_by(
            house_id=todo.house_id).all()

        for user in house_users:
            existing_notification = Notification.query.filter(
                and_(
                    Notification.item_type == ItemType.TODO,
                    Notification.item_id == todo.id,
                    Notification.user_id == user.id,
                    Notification.is_removed != True,
                )
            ).first()

            if not existing_notification:
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
                    created_on=datetime.now().strftime(
                        "%Y-%m-%d %H:%M:%S"),
                    href=f"/home/todo",
                    user_id=user.id,
                )
                db.session.add(notification)
                pending_pushes.append((
                    user.id, notification.name,
                    notification.description, notification.href))

    db.session.commit()
    for user_id, title, body, href in pending_pushes:
        send_push_notification(user_id, title, body, href)
    logging.info(
        f"Added {count_added_notifications} notifications for expired todos.")


def check_deadlines():
    logging.info("Checking deadlines for reminders, chores, and todos")
    check_reminders()
    check_chores()
    check_todos()
