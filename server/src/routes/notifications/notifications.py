from flask import Blueprint, request, jsonify
from pathlib import Path
import uuid
import logging
from datetime import datetime

from db.db import db
from utils.utils import login_required, send_push_notification
from utils.api_errors import NotFoundError, AuthorizationError, AuthenticationError
from models.models import Notification, PushSubscription
from models.types import ItemType, NotificationType, NotificationSeverity
from config.settings import settings

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
    send_push_notification(user.id, name, description, href)
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


@notifications.route('/push/vapid-public-key', methods=['GET'])
@login_required
def get_vapid_public_key(user):
    """Return the VAPID public key so the browser can subscribe."""
    import os
    public_key = os.environ.get("VAPID_PUBLIC_KEY", "")
    logging.debug(
        f"[PUSH] vapid-public-key requested by user={user.id}, key={'set' if public_key else 'MISSING'} (len={len(public_key)})")
    return jsonify({"public_key": public_key})


@notifications.route('/push/subscribe', methods=['POST'])
@login_required
def push_subscribe(user):
    """Store a push subscription for the authenticated user."""
    logging.debug(f"[PUSH] subscribe called by user={user.id}")
    subscription_json = request.json.get("subscription")
    if not subscription_json:
        logging.warning("[PUSH] subscribe: missing subscription data")
        return jsonify({"error": "Missing subscription data"}), 400

    endpoint = subscription_json.get("endpoint")
    keys = subscription_json.get("keys", {})
    p256dh = keys.get("p256dh")
    auth = keys.get("auth")

    logging.debug(
        f"[PUSH] subscribe: endpoint={endpoint[:80] if endpoint else 'None'}..., p256dh={'set' if p256dh else 'MISSING'}, auth={'set' if auth else 'MISSING'}")

    if not all([endpoint, p256dh, auth]):
        logging.warning("[PUSH] subscribe: invalid subscription data")
        return jsonify({"error": "Invalid subscription data"}), 400

    # Update existing subscription or create new one
    existing = PushSubscription.query.filter_by(
        user_id=user.id, endpoint=endpoint
    ).first()

    if existing:
        existing.p256dh_key = p256dh
        existing.auth_key = auth
        db.session.commit()
        logging.debug(
            f"[PUSH] subscribe: updated existing subscription {existing.id}")
        return jsonify({"message": "Subscription updated"}), 200

    sub = PushSubscription(
        id=str(uuid.uuid4()),
        user_id=user.id,
        endpoint=endpoint,
        p256dh_key=p256dh,
        auth_key=auth,
        created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.session.add(sub)
    db.session.commit()
    logging.debug(f"[PUSH] subscribe: created new subscription {sub.id}")
    return jsonify({"message": "Subscription created"}), 201


@notifications.route('/push/unsubscribe', methods=['POST'])
@login_required
def push_unsubscribe(user):
    """Remove a push subscription."""
    logging.debug(f"[PUSH] unsubscribe called by user={user.id}")
    endpoint = request.json.get("endpoint")
    if not endpoint:
        return jsonify({"error": "Missing endpoint"}), 400

    sub = PushSubscription.query.filter_by(
        user_id=user.id, endpoint=endpoint
    ).first()

    if sub:
        logging.debug(f"[PUSH] unsubscribe: removing subscription {sub.id}")
        db.session.delete(sub)
        db.session.commit()
    else:
        logging.debug(
            f"[PUSH] unsubscribe: no subscription found for endpoint")

    return jsonify({"message": "Unsubscribed"}), 200
