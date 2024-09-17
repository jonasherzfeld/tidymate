from flask import request, jsonify
from config import app, db
from models import Contact

@app.route("/")
@app.route("/contacts")
def get_contacts():
    contacts_raw = db.get_all_data("contacts")
    contacts = [Contact(id=c['id'],
                        first_name=c['data']['firstName'],
                        last_name=c['data']['lastName'],
                        email=c['data']['email'])
                        for c in contacts_raw]
    contacts_json = [c.to_json() for c in contacts]
    return jsonify({"contacts": contacts_json})

@app.route("/create_contact", methods=["POST"])
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

@app.route("/update_contact/<string:user_id>", methods=["PATCH"])
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

@app.route("/delete_contact/<string:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    res = db.delete_data("contacts", user_id)
    if not res:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"message": "User deleted"}), 200


if __name__ == "__main__":
    app.run(debug=True)
