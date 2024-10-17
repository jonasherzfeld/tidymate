from flask import Blueprint, request, jsonify, flash, render_template, session
import json

from config import db
from view_models import NoteViewModel, UserViewModel

views = Blueprint('views', __name__)

@views.route('/', methods=['GET'])
def home():
    return render_template("index.html")

@views.route('/get', methods=['GET'])
def get_notes():
    # Authorize user
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    vm = NoteViewModel()
    if request.method == 'POST':
        note = request.form.get('note')#Gets the note from the HTML

        if len(note) < 1:
            flash('Note is too short!', category='error')
        else:
            vm.set(user_id, note)
            flash('Note added!', category='success')
    notes = vm.get_all(user_id)

@views.route("/delete_note/<string:node_id>", methods=["DELETE"])
def delete_note(node_id):
    # Authorize user
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    vm = NoteViewModel()
    ret = vm.delete(user_id, node_id)
    print("Deleted note: ", ret)
    return jsonify({})
