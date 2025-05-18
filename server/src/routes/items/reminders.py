from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
import uuid

from db.db import db
from models.models import House, Reminder
from utils.utils import login_required

reminders = Blueprint('reminders', __name__)


@reminders.route('/create-reminder', methods=["POST"])
@login_required
def create_reminder(user):
    data = request.json.get("data", "")
    assignee = request.json.get("assignee", "")
    deadline = request.json.get("deadline", "")
    frequency = request.json.get("frequency", 0)
    last_done = request.json.get("last_done", "")
    category = request.json.get("category", "")

    if deadline == "":
        deadline = (datetime.now() +
                    datetime.timedelta(days=frequency)).strftime("%Y-%m-%d")

    reminder = Reminder(id=str(uuid.uuid4()),
                        data=data,
                        assignee=assignee,
                        done=False,
                        created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        deadline=deadline,
                        frequency=frequency,
                        last_done=last_done,
                        category=category,
                        user=user
                        )
    db.session.add(reminder)
    db.session.commit()
    return jsonify({"reminder": reminder.to_dict()}), 200


@reminders.route('/get-reminders', methods=['GET'])
@login_required
def get_reminders(user):
    reminders = Reminder.query.filter_by(user_id=user.id)
    reminders_json = [reminder.to_dict()
                      for reminder in reminders] if reminders else []
    return jsonify({"reminders": reminders_json})


@reminders.route("/get-reminder/<string:reminder_id>", methods=["GET"])
@login_required
def get_reminder(user, reminder_id):
    reminder = Reminder.query.filter_by(id=reminder_id).first()
    if not reminder:
        return jsonify({"error": "Reminder not found"}), 404
    elif not reminder.id == user.id:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"reminder": reminder.to_dict()})


@reminders.route('/check-reminder/<string:reminder_id>', methods=['PATCH'])
@login_required
def check_reminders(user, reminder_id):
    reminder = Reminder.query.filter_by(id=reminder_id).first()
    if not reminder:
        return jsonify({"error": "Reminder not found"}), 404
    elif not reminder.id == user.id:
        return jsonify({"error": "Unauthorized"}), 401

    reminder.last_done = datetime.now().strftime("%Y-%m-%d")
    reminder.deadline = (
        datetime.now() + timedelta(days=reminder.frequency)).strftime("%Y-%m-%d")

    db.session.commit()
    return jsonify({
        "reminder": reminder.to_dict(),
    }), 200


@reminders.route('/update-reminder', methods=['PATCH'])
@login_required
def update_reminders(user):
    reminder_id = request.json.get("id", None)
    if not reminder_id:
        return jsonify({"error": "Reminder ID not provided"}), 400

    reminder = Reminder.query.filter_by(id=reminder_id).first()
    if not reminder:
        return jsonify({"error": "Reminder not found"}), 404
    elif not reminder.id == user.id:
        return jsonify({"error": "Unauthorized"}), 401

    reminder_text = request.json.get("data", None)
    reminder_assignee = request.json.get("assignee", None)
    reminder_deadline = request.json.get("deadline", None)
    reminder_frequency = request.json.get("frequency", None)
    reminder_category = request.json.get("category", None)

    if reminder_text:
        reminder.data = reminder_text
    if reminder_assignee is not None:
        reminder.assignee = reminder_assignee
    if reminder_deadline is not None:
        reminder.deadline = reminder_deadline
    if reminder_frequency is not None:
        reminder.frequency = reminder_frequency
    if reminder_category is not None:
        reminder.category = reminder_category

    db.session.commit()
    return jsonify({
        "reminder": reminder.to_dict(),
    }), 200


@reminders.route("/delete-reminder/<string:reminder_id>", methods=["DELETE"])
@login_required
def delete_reminder(user, reminder_id):
    Reminder.query.filter_by(id=reminder_id).delete()
    db.session.commit()
    return jsonify({}), 200
