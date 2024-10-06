from flask import Blueprint, request, jsonify, flash, render_template
from flask_login import login_required, current_user
import json

from config import db
from models_old.models import Contact
from view_models import NoteViewModel

views = Blueprint('views', __name__)

@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    vm = NoteViewModel()
    if request.method == 'POST':
        note = request.form.get('note')#Gets the note from the HTML

        if len(note) < 1:
            flash('Note is too short!', category='error')
        else:
            vm.set(note)
            flash('Note added!', category='success')
    notes = vm.get_all()
    return render_template("home.html", user=current_user, notes=notes)

@views.route('/delete-note', methods=['POST'])
def delete_note():
    note = json.loads(request.data) # this function expects a JSON from the INDEX.js file
    noteId = str(note['noteId'])
    vm = NoteViewModel()
    ret = vm.delete(noteId)
    print("Deleted note: ", ret)
    return jsonify({})

@views.route("/contacts")
def get_contacts():
    contacts_raw = db.get_all_data("contacts")
    contacts = [Contact(id=c['id'],
                        first_name=c['data']['firstName'],
                        last_name=c['data']['lastName'],
                        email=c['data']['email'])
                        for c in contacts_raw]
    contacts_json = [c.to_json() for c in contacts]
    return jsonify({"contacts": contacts_json})

@views.route("/create_contact", methods=["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    if not first_name or not last_name or not email:
        return (
            jsonify({"message": "You must include a first name, last name and email"}),
            400,
            )

    new_contact = Contact(None, first_name, last_name, email)
    try:
        db.set_data("contacts", new_contact.to_json())
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "User created"}), 201

@views.route("/update_contact/<string:user_id>", methods=["PATCH"])
def update_contact(user_id):
    print(user_id)
    contact = db.get_data_by_id("contacts", user_id)
    print(contact)
    if not contact:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    contact["firstName"] = data.get("firstName", contact["firstName"])
    contact["lastName"] = data.get("lastName", contact["lastName"])
    contact["email"] = data.get("email", contact["email"])

    db.update_data("contacts", user_id, contact)

    return jsonify({"message": "User updated"}), 200

@views.route("/delete_contact/<string:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    res = db.delete_data("contacts", user_id)
    if not res:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"message": "User deleted"}), 200

