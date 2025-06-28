from flask import Blueprint, request, jsonify
from pathlib import Path
import uuid
from datetime import datetime

from db.db import db
from utils.utils import login_required
from models.models import Notification, NotificationSeverity

CWD = Path(__file__).parent
BASE_DIR = CWD.parent.parent.parent.parent

notifications = Blueprint('notifications', __name__)


@notifications.route('/create-notification', methods=["POST"])
@login_required
def create_reminder(user):
    name = request.json.get("name", "")
    description = request.json.get("description", "")
    severity = NotificationSeverity.from_int(request.json.get("severity", 0))

    notification = Notification(
        id=str(uuid.uuid4()),
        name=name,
        description=description,
        severity=severity,
        is_viewed=False,
        created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_id=user.id
    )

    db.session.add(notification)
    db.session.commit()
    return jsonify({"notification": notification.to_dict()}), 200


@notifications.route('/get-notifications', methods=['GET'])
@login_required
def get_notifications(user):
    notifications = Notification.query.filter_by(user_id=user.id)
    notifications_json = [notification.to_dict()
                          for notification in notifications] if notifications else []
    return jsonify({"notifications": notifications_json})


@notifications.route('/view-notifications/<string:notification_id>', methods=['PATCH'])
@login_required
def view_notifications(user, notification_id):
    notification = Notification.query.filter_by(id=notification_id).first()
    if not notification:
        return jsonify({"error": "Notification not found"}), 404
    elif not notification.user_id == user.id:
        return jsonify({"error": "Unauthorized"}), 401

    notification.is_viewed = True

    db.session.add(notification)
    db.session.commit()
    return jsonify({"notification": notification.to_dict()})


@notifications.route("/delete-notifications/<string:notification_id>", methods=["DELETE"])
@login_required
def delete_notification(user, notification_id):
    Notification.query.filter_by(id=notification_id).delete()
    db.session.commit()
    return jsonify({}), 200
