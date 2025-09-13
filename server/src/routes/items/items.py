from datetime import datetime
from flask import Blueprint, request, jsonify, render_template
import uuid

from db.db import db
from models.models import Todo, House
from utils.utils import login_required, log_history_event, EventType
from utils.api_errors import NotFoundError, AuthorizationError, ValidationError

items = Blueprint('items', __name__)


@items.route('/create-todo', methods=["POST"])
@login_required
def create_todo(user):
    data = request.json.get("data", "")
    assignee = request.json.get("assignee", "")
    deadline = request.json.get("deadline", "")

    house = House.query.filter_by(id=user.house_id).first()
    if not house:
        raise NotFoundError("House not found")

    todo = Todo(id=str(uuid.uuid4()),
                data=data,
                assignee=assignee,
                done=False,
                created_on=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                deadline=deadline,
                house=house)
    db.session.add(todo)
    db.session.commit()

    # Log creation event
    log_history_event(
        EventType.CREATED,
        todo,
        "todo",
        user.id,
        user.house_id
    )

    return jsonify({"todo": todo.to_dict()})


@items.route('/get-todos', methods=['GET'])
@login_required
def get_todos(user):
    todos = Todo.query.filter_by(house_id=user.house_id)
    todos_json = [todo.to_dict() for todo in todos] if todos else []
    return jsonify({"todos": todos_json})


@items.route("/get-todo/<string:todo_id>", methods=["GET"])
@login_required
def get_todo(user, todo_id):
    todo = Todo.query.filter_by(id=todo_id).first()
    if not todo:
        raise NotFoundError("Todo not found")
    elif not todo.house_id == user.house_id:
        raise AuthorizationError("User is not authorized to access this todo")
    return jsonify({"todo": todo.to_dict()})


@items.route('/check-todo/<string:todo_id>', methods=['PATCH'])
@login_required
def check_todos(user, todo_id):
    todo = Todo.query.filter_by(id=todo_id).first()
    if not todo:
        raise NotFoundError("Todo not found")
    elif not todo.house_id == user.house_id:
        raise AuthorizationError("User is not authorized to access this todo")

    was_done = todo.done
    todo.done = not todo.done
    db.session.commit()

    # Log completion event when todo is marked as done
    if not was_done and todo.done:
        log_history_event(
            EventType.COMPLETED,
            todo,
            "todo",
            user.id,
            user.house_id
        )

    return jsonify({
        "todo": todo.to_dict(),
    }), 200


@items.route('/update-todo', methods=['PATCH'])
@login_required
def update_todos(user):
    todo_id = request.json.get("id", None)
    if not todo_id:
        raise ValidationError("Todo ID not provided")

    todo = Todo.query.filter_by(id=todo_id).first()
    if not todo:
        raise NotFoundError("Todo not found")
    elif not todo.house_id == user.house_id:
        raise AuthorizationError("User is not authorized to access this todo")

    todo_text = request.json.get("data", None)
    todo_assignee = request.json.get("assignee", None)
    todo_deadline = request.json.get("deadline", None)

    if todo_text:
        todo.data = todo_text
    if todo_assignee is not None:
        todo.assignee = todo_assignee
    if todo_deadline is not None:
        todo.deadline = todo_deadline

    db.session.commit()
    return jsonify({
        "todo": todo.to_dict(),
    }), 200


@items.route("/delete-todo/<string:todo_id>", methods=["DELETE"])
@login_required
def delete_todo(user, todo_id):
    house = House.query.filter_by(id=user.house_id).first()
    if not house:
        raise NotFoundError("House not found")

    todo = Todo.query.filter_by(id=todo_id).first()
    if todo:
        # Log deletion event before deleting
        log_history_event(
            EventType.DELETED,
            todo,
            "todo",
            user.id,
            user.house_id
        )

    Todo.query.filter_by(id=todo_id).delete()
    db.session.commit()
    return jsonify({}), 200
