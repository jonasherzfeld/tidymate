from flask import Blueprint, jsonify
from sqlalchemy import and_

from db.db import db
from models.models import History, EventType
from utils.utils import login_required

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


@history.route('/delete-history/<string:item_type>', methods=['DELETE'])
@login_required
def delete_history_by_item_type(user, item_type):
    """Delete all history events for a specific item type"""
    # Validate item_type
    valid_item_types = ["todo", "chore", "reminder"]
    if item_type not in valid_item_types:
        return jsonify({"error": "Invalid item type"}), 400

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
