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

@items.route("/get-todo/<string:todo_id>", methods=["GET"])
@login_required
def get_todo(user, todo_id):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404
    todo = todo_vm.get(user.house_id, todo_id)
    return jsonify({ "todo": todo.to_json() })

@items.route('/check-todo/<string:todo_id>', methods=['PATCH'])
@login_required
def check_todos(user, todo_id):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404

    todo = todo_vm.get(house.id, todo_id)
    if not todo:
        return jsonify({"error": "Todo not found"}), 404

    todo.done = not todo.done
    todo_vm.update(house.id, todo_id, todo)
    return jsonify({
        "todo": todo.to_json(),
    }), 200

@items.route('/update-todo', methods=['PATCH'])
@login_required
def update_todos(user):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404

    todo_id = request.json.get("id", None)
    if not todo_id:
        return jsonify({"error": "Todo ID not provided"}), 400
    todo = todo_vm.get(house.id, todo_id)

    todo_text = request.json.get("data", None)
    todo_assignee = request.json.get("assignee", None)
    todo_deadline = request.json.get("deadline", None)

    if todo_text:
        todo.data = todo_text
    if todo_assignee is not None:
        todo.assignee = todo_assignee
    if todo_deadline is not None:
        todo.deadline = todo_deadline

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
