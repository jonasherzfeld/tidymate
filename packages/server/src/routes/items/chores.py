from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
import uuid

from models.models import Todo, User, House, Chore
from models.view_models import ChoreViewModel, HouseViewModel
from utils.utils import login_required

chores = Blueprint('chores', __name__)

house_vm = HouseViewModel()
chore_vm = ChoreViewModel()


@chores.route('/create-chore', methods=["POST"])
@login_required
def create_chore(user):
    data = request.json.get("data", "")
    assignee = request.json.get("assignee", "")
    tags = request.json.get("tags", [])
    deadline = request.json.get("deadline", "")
    frequency = request.json.get("frequency", 0)
    last_done = request.json.get("last_done", "")
    room = request.json.get("room", "")
    severity = ChoreSeverity.from_int(request.json.get("severity", 0))

    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404

    if deadline == "":
        deadline = (datetime.now() +
                    datetime.timedelta(days=frequency)).strftime("%Y-%m-%d")

    chore = Chore(id=str(uuid.uuid4()),
                  data=data,
                  assignee=assignee,
                  done=False,
                  tags=tags,
                  created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                  deadline=deadline,
                  frequency=frequency,
                  last_done=last_done,
                  room=room,
                  severity=severity
                  )
    ret = chore_vm.set(user.house_id, chore)
    if ret:
        return jsonify({"chore": chore.to_json()}), 200

    return jsonify({"error": "Could not create chore"}), 500


@chores.route('/get-chores', methods=['GET'])
@login_required
def get_chores(user):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404
    chores = chore_vm.get_all(user.house_id)
    chores_json = [chore.to_json() for chore in chores]
    return jsonify({"chores": chores_json})


@chores.route("/get-chore/<string:chore_id>", methods=["GET"])
@login_required
def get_chore(user, chore_id):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404
    chore = chore_vm.get(user.house_id, chore_id)
    return jsonify({"chore": chore.to_json()})


@chores.route('/check-chore/<string:chore_id>', methods=['PATCH'])
@login_required
def check_chores(user, chore_id):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404

    chore = chore_vm.get(house.id, chore_id)
    if not chore:
        return jsonify({"error": "Chore not found"}), 404

    chore.last_done = datetime.now().strftime("%Y-%m-%d"),
    chore.deadline = (
        datetime.now() + timedelta(days=chore.frequency)).strftime("%Y-%m-%d")
    chore_vm.update(house.id, chore)
    return jsonify({
        "chore": chore.to_json(),
    }), 200


@chores.route('/update-chore', methods=['PATCH'])
@login_required
def update_chores(user):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404

    chore_id = request.json.get("id", None)
    if not chore_id:
        return jsonify({"error": "Chore ID not provided"}), 400
    chore = chore_vm.get(house.id, chore_id)

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

    chore_vm.update(house.id, chore)
    return jsonify({
        "chore": chore.to_json(),
    }), 200


@chores.route("/delete-chore/<string:chore_id>", methods=["DELETE"])
@login_required
def delete_chore(user, chore_id):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404
    ret = chore_vm.delete(user.house_id, chore_id)
    if ret:
        return jsonify({"message": "Chore deleted successfully"})
    return jsonify({"error": "Chore not found"}), 404
