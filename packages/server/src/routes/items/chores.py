from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
import uuid

from config import db
from models.models import House, Chore, ChoreSeverity
from utils.utils import login_required

chores = Blueprint('chores', __name__)


@chores.route('/create-chore', methods=["POST"])
@login_required
def create_chore(user):
    data = request.json.get("data", "")
    assignee = request.json.get("assignee", "")
    # tags = request.json.get("tags", [])
    deadline = request.json.get("deadline", "")
    frequency = request.json.get("frequency", 0)
    last_done = request.json.get("last_done", "")
    room = request.json.get("room", "")
    severity = ChoreSeverity.from_int(request.json.get("severity", 0))

    house = House.query.filter_by(id=user.house_id).first()
    if not house:
        return jsonify({"error": "House not found"}), 404

    if deadline == "":
        deadline = (datetime.now() +
                    datetime.timedelta(days=frequency)).strftime("%Y-%m-%d")

    chore = Chore(data=data,
                  assignee=assignee,
                  done=False,
                  created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                  deadline=deadline,
                  frequency=frequency,
                  last_done=last_done,
                  room=room,
                  severity=severity,
                  house=house
                  )
    db.session.add(chore)
    db.session.commit()
    return jsonify({"chore": chore.to_dict()}), 200


@chores.route('/get-chores', methods=['GET'])
@login_required
def get_chores(user):
    chores = Chore.query.filter_by(house_id=user.house_id)
    chores_json = [chore.to_dict() for chore in chores] if chores else []
    return jsonify({"chores": chores_json})


@chores.route("/get-chore/<string:chore_id>", methods=["GET"])
@login_required
def get_chore(user, chore_id):
    chore = Chore.query.filter_by(id=chore_id).first()
    if not chore:
        return jsonify({"error": "Chore not found"}), 404
    elif not chore.house_id == user.house_id:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"chore": chore.to_dict()})


@chores.route('/check-chore/<string:chore_id>', methods=['PATCH'])
@login_required
def check_chores(user, chore_id):
    chore = Chore.query.filter_by(id=chore_id).first()
    if not chore:
        return jsonify({"error": "Chore not found"}), 404
    elif not chore.house_id == user.house_id:
        return jsonify({"error": "Unauthorized"}), 401

    chore.last_done = datetime.now().strftime("%Y-%m-%d")
    chore.deadline = (
        datetime.now() + timedelta(days=chore.frequency)).strftime("%Y-%m-%d")

    db.session.commit()
    return jsonify({
        "chore": chore.to_dict(),
    }), 200


@chores.route('/update-chore', methods=['PATCH'])
@login_required
def update_chores(user):
    chore_id = request.json.get("id", None)
    if not chore_id:
        return jsonify({"error": "Chore ID not provided"}), 400

    chore = Chore.query.filter_by(id=chore_id).first()
    if not chore:
        return jsonify({"error": "Chore not found"}), 404
    elif not chore.house_id == user.house_id:
        return jsonify({"error": "Unauthorized"}), 401

    chore_text = request.json.get("data", None)
    chore_assignee = request.json.get("assignee", None)
    chore_deadline = request.json.get("deadline", None)
    chore_frequency = request.json.get("frequency", None)
    chore_room = request.json.get("room", None)

    if chore_text:
        chore.data = chore_text
    if chore_assignee is not None:
        chore.assignee = chore_assignee
    if chore_deadline is not None:
        chore.deadline = chore_deadline
    if chore_frequency is not None:
        chore.frequency = chore_frequency
    if chore_room is not None:
        chore.room = chore_room

    db.session.commit()
    return jsonify({
        "chore": chore.to_dict(),
    }), 200


@chores.route("/delete-chore/<string:chore_id>", methods=["DELETE"])
@login_required
def delete_chore(user, chore_id):
    house = House.query.filter_by(id=user.house_id).first()
    if not house:
        return jsonify({"error": "House not found"}), 404
    Chore.query.filter_by(id=chore_id).delete()
    db.session.commit()
    return jsonify({"error": "Chore not found"}), 404
