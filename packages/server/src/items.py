from datetime import datetime
from flask import Blueprint, request, jsonify, render_template
import uuid

from models import Todo
from view_models import TodoViewModel, HouseViewModel
from auth import login_required, validate_house_member

items = Blueprint('items', __name__)

house_vm = HouseViewModel()
todo_vm = TodoViewModel()

@items.route('/create-todo', methods=["POST"])
@login_required
def create_todo(user):
    data = request.json.get("data", "")
    assignee = request.json.get("assignee", "")
    tags = request.json.get("tags", [])
    deadline = request.json.get("deadline", "")

    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404

    todo = Todo(id=str(uuid.uuid4()),
                data=data,
                assignee=assignee,
                done=False,
                tags=tags,
                created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                deadline=deadline)
    ret = todo_vm.set(user.house_id, todo.id, todo)
    if ret:
        return jsonify({ "todo": todo.to_json() }), 200

    return jsonify({"error": "Could not create todo"}), 500

@items.route('/get-todos', methods=['GET'])
@login_required
def get_todos(user):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404
    todos = todo_vm.get_all(user.house_id)
    todos_json = [todo.to_json() for todo in todos]
    return jsonify({ "todos": todos_json })

@items.route('/update-todo', methods=['PATCH'])
@login_required
def update_todos(user):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404

    todo = request.json.get("todo", None)
    if not todo:
        return jsonify({"error": "Todo not found"}), 404

    todo_vm.update(house.id, todo.id, todo)
    return jsonify({
        "todo": todo.to_json(),
    }), 200


@items.route("/delete-todo/<string:todo_id>", methods=["DELETE"])
@login_required
def delete_todo(user, todo_id):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404
    ret = todo_vm.delete(user.house_id, todo_id)
    if ret:
        return jsonify({"message": "Todo deleted successfully"})
    return jsonify({"error": "Todo not found"}), 404
