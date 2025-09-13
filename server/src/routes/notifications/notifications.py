from flask import Blueprint, request, jsonify
from pathlib import Path
import uuid
from datetime import datetime

from db.db import db
from utils.utils import login_required
from utils.api_errors import NotFoundError, AuthorizationError, AuthenticationError
from models.models import Notification
from models.types import ItemType, NotificationType, NotificationSeverity

CWD = Path(__file__).parent
BASE_DIR = CWD.parent.parent.parent.parent

notifications = Blueprint('notifications', __name__)


@notifications.route('/create-notification', methods=["POST"])
@login_required
def create_notification(user):
    name = request.json.get("name", "")
    description = request.json.get("description", "")
    severity = NotificationSeverity.from_int(request.json.get("severity", 0))
    href = request.json.get("href", "")
    notification_type = request.json.get("notification_type", "info")
    item_type = request.json.get("item_type", "none")
    item_id = request.json.get("item_id", "")

    notification = Notification(
        id=str(uuid.uuid4()),
        notification_type=NotificationType.from_string(notification_type),
        item_type=ItemType.from_string(item_type),
        item_id=item_id,
        name=name,
        description=description,
        severity=severity,
        is_viewed=False,
        is_removed=False,
        created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        href=href,
        user_id=user.id
    )

    db.session.add(notification)
    db.session.commit()
    return jsonify({"notification": notification.to_dict()}), 200


@notifications.route('/get-notifications', methods=['GET'])
@login_required
def get_notifications(user):
    notifications = Notification.query.filter_by(user_id=user.id)
    if not notifications:
        return jsonify({"notifications": []})

    notifications_json = [notification.to_dict()
                          for notification in notifications if not notification.is_removed]
    return jsonify({"notifications": notifications_json})


@notifications.route('/view-notification/<string:notification_id>',
                     methods=['PATCH'])
@login_required
def view_notification(user, notification_id):
    notification = Notification.query.filter_by(id=notification_id).first()
    if not notification:
        raise NotFoundError("Notification not found")
    elif not notification.user_id == user.id:
        raise AuthorizationError(
            "User is not authorized to access this notification")

    notification.is_viewed = True

    db.session.add(notification)
    db.session.commit()
    return jsonify({"notification": notification.to_dict()})


@notifications.route("/delete-notification/<string:notification_id>",
                     methods=["DELETE"])
@login_required
def delete_notification(user, notification_id):
    notification = Notification.query.filter_by(id=notification_id).first()
    if not notification:
        raise NotFoundError("Notification not found")
    elif not notification.user_id == user.id:
        raise AuthorizationError(
            "User is not authorized to access this notification")

    notification.is_viewed = True
    notification.is_removed = True

    db.session.add(notification)
    db.session.commit()
    return jsonify({}), 200


@notifications.route("/delete-all-notifications", methods=["DELETE"])
@login_required
def delete_all_notifications(user):
    notifications = Notification.query.filter_by(user_id=user.id)
    for notification in notifications:
        notification.is_removed = True
    db.session.commit()
    return jsonify({}), 200
