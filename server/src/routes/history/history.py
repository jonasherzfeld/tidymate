import json
import logging
from collections import Counter
from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify
from sqlalchemy import and_

from db.db import db
from models.models import History, EventType
from utils.utils import login_required
from utils.api_errors import ValidationError

history = Blueprint('history', __name__)


@history.route('/get-history', methods=['GET'])
@login_required
def get_history(user):
    """Get all history events for the user's house"""
    history_events = History.query.filter_by(
        house_id=user.house_id).order_by(History.created_on.desc()).all()
    history_json = [event.to_dict()
                    for event in history_events] if history_events else []
    return jsonify({"history": history_json})


@history.route('/get-completion-stats', methods=['GET'])
@login_required
def get_completion_stats(user):
    """Get completion statistics for the household (excluding private reminders)"""
    # Get only chore and todo completion events for the house (exclude
    # reminders)
    completion_events = History.query.filter(
        and_(
            History.house_id == user.house_id,
            History.event_type == EventType.COMPLETED,
            History.item_type.in_(["todo", "chore"])  # Exclude reminders
        )
    ).all()

    stats = {
        'total_completed': len(completion_events),
        'completed_todos': len([e for e in completion_events if e.item_type == "todo"]),
        'completed_chores': len([e for e in completion_events if e.item_type == "chore"]),
        'by_user': {}
    }

    # Group by user
    for event in completion_events:
        if event.user_id not in stats['by_user']:
            stats['by_user'][event.user_id] = {
                'total': 0,
                'todos': 0,
                'chores': 0
            }

        stats['by_user'][event.user_id]['total'] += 1

        if event.item_type == "todo":
            stats['by_user'][event.user_id]['todos'] += 1
        elif event.item_type == "chore":
            stats['by_user'][event.user_id]['chores'] += 1

    return jsonify({"stats": stats})


@history.route('/get-personal-stats', methods=['GET'])
@login_required
def get_personal_stats(user):
    """Get personal completion statistics including reminders"""
    # Get all completion events for the current user (including reminders)
    personal_completion_events = History.query.filter(
        and_(
            History.user_id == user.id,
            History.event_type == EventType.COMPLETED
        )
    ).all()

    stats = {
        'total_completed': len(personal_completion_events),
        'completed_todos': len([e for e in personal_completion_events if e.item_type == "todo"]),
        'completed_chores': len([e for e in personal_completion_events if e.item_type == "chore"]),
        'completed_reminders': len([e for e in personal_completion_events if e.item_type == "reminder"])
    }

    return jsonify({"stats": stats})


@history.route('/get-home-stats', methods=['GET'])
@login_required
def get_home_stats(user):
    """Get achievement stats for the home page."""
    now = datetime.now(timezone.utc)
    thirty_days_ago_dt = now - timedelta(days=30)
    thirty_days_ago = thirty_days_ago_dt.strftime("%Y-%m-%d %H:%M:%S")
    fourteen_days_ago_dt = now - timedelta(days=13)
    fourteen_days_ago = fourteen_days_ago_dt.strftime("%Y-%m-%d %H:%M:%S")

    # Household completions (chores + todos) for breakdowns/totals
    household_events = History.query.filter(
        and_(
            History.house_id == user.house_id,
            History.event_type == EventType.COMPLETED,
            History.item_type.in_(["chore", "todo"])
        )
    ).all()

    chore_events = [e for e in household_events if e.item_type == "chore"]
    todo_events = [e for e in household_events if e.item_type == "todo"]
    last_month_chores = [
        e for e in chore_events if e.created_on >= thirty_days_ago]
    last_month_todos = [
        e for e in todo_events if e.created_on >= thirty_days_ago]

    # Strongest room from chore completions
    room_counts = Counter()
    for event in chore_events:
        try:
            item_data = json.loads(
                event.item_serialized) if event.item_serialized else {}
            room = item_data.get("room", "")
            if room and room.strip():
                room_counts[room.strip()] += 1
        except (json.JSONDecodeError, TypeError):
            pass

    strongest_room = None
    strongest_room_count = 0
    if room_counts:
        strongest_room, strongest_room_count = room_counts.most_common(1)[0]

    # Reminder completions (user's own)
    reminder_events = History.query.filter(
        and_(
            History.user_id == user.id,
            History.event_type == EventType.COMPLETED,
            History.item_type == "reminder"
        )
    ).all()

    last_month_reminders = [
        e for e in reminder_events if e.created_on >= thirty_days_ago]

    # Strongest category from reminder completions
    category_counts = Counter()
    for event in reminder_events:
        try:
            item_data = json.loads(
                event.item_serialized) if event.item_serialized else {}
            category = item_data.get("category", "")
            if category and category.strip():
                category_counts[category.strip()] += 1
        except (json.JSONDecodeError, TypeError):
            pass

    strongest_category = None
    strongest_category_count = 0
    if category_counts:
        strongest_category, strongest_category_count = category_counts.most_common(1)[
            0]

    # Combined completions (household + personal reminders) for weekly view.
    # Bucket by user-local date is impractical server-side; we bucket by UTC
    # date which is good enough for the dashboard sparkline.
    all_recent = [
        e for e in household_events + reminder_events
        if e.created_on >= fourteen_days_ago
    ]

    today_utc = now.date()
    daily_counts = [0] * 14  # oldest -> newest
    completions_by_date: dict[str, list[dict]] = {}
    for e in all_recent:
        try:
            event_date = datetime.strptime(
                e.created_on[:10], "%Y-%m-%d").date()
        except (ValueError, TypeError):
            continue
        idx = 13 - (today_utc - event_date).days
        if 0 <= idx < 14:
            daily_counts[idx] += 1

        # Extract item details for the per-day timeline.
        try:
            item_data = json.loads(
                e.item_serialized) if e.item_serialized else {}
        except (json.JSONDecodeError, TypeError):
            item_data = {}
        category = item_data.get("room") if e.item_type == "chore" \
            else item_data.get("category") if e.item_type == "reminder" \
            else None
        date_key = event_date.isoformat()
        completions_by_date.setdefault(date_key, []).append({
            "id": e.item_id,
            "name": e.item_data or item_data.get("data") or "",
            "kind": e.item_type,
            "category": (category or "").strip() or None,
            "completed_at": e.created_on,
        })

    this_week_count = sum(daily_counts[7:])
    prev_week_count = sum(daily_counts[:7])

    # Streak: consecutive days ending today (or yesterday) with >=1 completion.
    streak_days = 0
    for c in reversed(daily_counts):
        if c > 0:
            streak_days += 1
        else:
            break

    return jsonify({
        "stats": {
            "household": {
                "total_completed": len(household_events),
                "last_month_completed": len(last_month_chores) + len(last_month_todos),
                "completed_chores": len(chore_events),
                "completed_todos": len(todo_events),
                "last_month_chores": len(last_month_chores),
                "last_month_todos": len(last_month_todos),
                "strongest_room": strongest_room,
                "strongest_room_count": strongest_room_count,
                "room_breakdown": dict(room_counts),
            },
            "reminders": {
                "total_completed": len(reminder_events),
                "last_month_completed": len(last_month_reminders),
                "strongest_category": strongest_category,
                "strongest_category_count": strongest_category_count,
                "category_breakdown": dict(category_counts),
            },
            "this_week": {
                "completed_count": this_week_count,
                "prev_week_count": prev_week_count,
                "daily_counts": daily_counts,
                "streak_days": streak_days,
                "completions_by_date": completions_by_date,
            }
        }
    })


@history.route('/delete-history/<string:item_type>', methods=['DELETE'])
@login_required
def delete_history_by_item_type(user, item_type):
    """Delete all history events for a specific item type"""
    # Validate item_type
    valid_item_types = ["todo", "chore", "reminder"]
    if item_type not in valid_item_types:
        raise ValidationError("Invalid item type")

    # Delete history events for the specific item type in user's house
    deleted_count = History.query.filter(
        and_(
            History.house_id == user.house_id,
            History.item_type == item_type
        )
    ).delete()

    db.session.commit()

    return jsonify({
        "message": f"Deleted {deleted_count} {item_type} history events",
        "deleted_count": deleted_count
    }), 200
