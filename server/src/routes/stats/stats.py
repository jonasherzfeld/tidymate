from flask import Blueprint, request, jsonify
from models.view_models import ChoreViewModel, HouseViewModel
from utils.utils import login_required

stats = Blueprint('stats', __name__)

house_vm = HouseViewModel()
chore_vm = ChoreViewModel()


@stats.route('/get-todo-stats', methods=['GET'])
@login_required
def get_todo_stats(user):
    house = house_vm.get(user.house_id)
    if not house:
        return jsonify({"error": "House not found"}), 404
    chores = chore_vm.get_all(user.house_id)
    chores_json = [chore.to_json() for chore in chores]
    return jsonify({"chores": chores_json})
