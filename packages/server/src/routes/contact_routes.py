from flask import request, jsonify
from packages.server.src.config.config import db
from packages.server.src.models.models import Contact

def get_contacts():
    contacts_raw = db.get_all_data("contacts")
    contacts = [Contact(id=c['id'],
                        first_name=c['data']['firstName'],
                        last_name=c['data']['lastName'],
                        email=c['data']['email'])
                        for c in contacts_raw]
    contacts_json = [c.to_json() for c in contacts]
    return jsonify({"contacts": contacts_json})

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

def delete_contact(user_id):
    res = db.delete_data("contacts", user_id)
    if not res:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"message": "User deleted"}), 200
