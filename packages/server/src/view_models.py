from datetime import datetime
import uuid
from google.cloud.firestore_v1.base_query import FieldFilter

from config import db
from models import Note, User, House

USER_COLLECTION : str = "user"
HOUSE_COLLECTION : str = "house"
NOTES_COLLECTION : str = "notes"

class NoteViewModel():

    def get(self, user_id: str, note_id: str) -> Note:
        doc_ref = db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(NOTES_COLLECTION).document(note_id)
        doc = doc_ref.get()
        if doc.exists:
            doc_json = doc.to_dict()
            return Note(doc_json["id"], doc_json["data"], doc_json["date"])
        else:
            print(f"Document {id} not found")
            return None

    def get_all(self, user_id: str) -> list:
        docs = (
            db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(NOTES_COLLECTION).stream()
        )

        note_list = list()
        for doc in docs:
            doc_data = doc.to_dict()
            doc_data['id'] = doc.id
            doc_data['data'] = doc._data["data"]

            note = Note(doc.id, doc._data["data"], doc._data["date"])
            note_list.append(note)

        return note_list

    def set(self, user_id: str, data : str) -> bool:
        note_id = str(uuid.uuid4())
        doc_ref = db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(NOTES_COLLECTION).document(note_id)
        note = Note(note_id, data, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        doc_ref.set(note.to_json())
        return True

    def update(self, user_id: str, note_id: str, data : str) -> bool:
        doc_ref = db.collection(HOUSE_COLLECTION) \
                        .document(house_id) \
                        .collection(NOTES_COLLECTION) \
                        .document(note_id)
        doc = doc_ref.get()
        if doc.exists:
            note = Note(note_id, data, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            doc_ref.update(note.to_json())
            return True
        else:
            print(f"Document {note_id} not found")
            return False

    def delete(self, house_id: str, note_id: str):
        try:
            doc_ref = db.collection(HOUSE_COLLECTION) \
                        .document(house_id) \
                        .collection(NOTES_COLLECTION) \
                        .document(note_id)
            doc_ref.delete()
            return True
        except Exception as e:
            print(f"Error deleting document: {str(e)}")
            return False

class HouseViewModel():

    def get(self, id: int) -> User:
        doc_ref = db.collection(HOUSE_COLLECTION).document(id)
        doc = doc_ref.get()
        if doc.exists:
            doc_json = doc.to_dict()
            return House(doc_json["id"],
                        doc_json["name"],
                        doc_json["city"],
                        doc_json["country"],
                        doc_json["created_on"],
                        doc_json["join_id"],
                        doc_json["members"])
        else:
            print(f"Document {id} not found in collection {USER_COLLECTION}")
            return None

    def filter(self, field: str, join_id: str) -> list:
        try:
            doc_ref = db.collection(HOUSE_COLLECTION)
            query = doc_ref.where(filter=FieldFilter(field, "==", join_id))
            docs = query.stream()

            doc_list = list()
            for doc in docs:
                doc_data = doc.to_dict()
                user = House(doc_data["id"],
                            doc_data["name"],
                            doc_data["city"],
                            doc_data["country"],
                            doc_data["created_on"],
                            doc_data["join_id"],
                            doc_data["members"])
                doc_list.append(user)

            return doc_list
        except Exception as e:
            print(f"Error retrieving documents: {str(e)}")
            return None

    def set(self, id: str, data : House) -> bool:
        doc_ref = db.collection(HOUSE_COLLECTION).document(id)
        doc_ref.set(data.to_json())
        if doc_ref.get().exists:
            return True
        else:
            print(f"Document could not be set collection {HOUSE_COLLECTION}")
            return False


    def update(self, id: str, data : House) -> bool:
        doc_ref = db.collection(HOUSE_COLLECTION).document(id)
        if doc_ref.get().exists:
            doc_ref.update(data.to_json())
            return True
        else:
            print(f"Document {id} not found in collection {HOUSE_COLLECTION}")
            return False

    def delete(self, id: str) -> bool:
        try:
            doc_ref = db.collection(HOUSE_COLLECTION).document(id)
            doc_ref.delete()
            return True
        except Exception as e:
            print(f"Error deleting document: {str(e)}")
            return False


class UserViewModel():

    def get(self, id: int) -> User:
        doc_ref = db.collection(USER_COLLECTION).document(id)
        doc = doc_ref.get()
        if doc.exists:
            doc_json = doc.to_dict()
            return User(doc_json["id"],
                        doc_json["email"],
                        doc_json["first_name"],
                        doc_json["last_name"],
                        doc_json["joined_on"],
                        doc_json["house_id"],
                        doc_json["thumbnail"],
                        doc_json["is_admin"])
        else:
            print(f"Document {id} not found in collection {USER_COLLECTION}")
            return None

    def filter(self, email: str) -> list:
        try:
            doc_ref = db.collection(USER_COLLECTION)
            query = doc_ref.where(filter=FieldFilter("email", "==", email))
            docs = query.stream()

            doc_list = list()
            for doc in docs:
                doc_data = doc.to_dict()
                print(doc_data)
                user = User(doc_data["id"],
                            doc_data["email"],
                            doc_data["first_name"],
                            doc_data["last_name"],
                            doc_data["joined_on"],
                            doc_data["house_id"],
                            doc_data["thumbnail"],
                            doc_data["is_admin"])

                doc_list.append(user)

            return doc_list
        except Exception as e:
            print(f"Error retrieving documents: {str(e)}")
            return None

    def set(self, id: str, data : User) -> bool:
        doc_ref = db.collection(USER_COLLECTION).document(id)
        doc_ref.set(data.to_json())
        if doc_ref.get().exists:
            return True
        else:
            print(f"Document could not be set collection {USER_COLLECTION}")
            return False


    def update(self, id: str, data : User) -> bool:
        doc_ref = db.collection(USER_COLLECTION).document(id)
        if doc_ref.get().exists:
            doc_ref.update(data.to_json())
            return True
        else:
            print(f"Document {id} not found in collection {USER_COLLECTION}")
            return False

    def delete(self, id: str) -> bool:
        try:
            doc_ref = db.collection(USER_COLLECTION).document(id)
            doc_ref.delete()
            return True
        except Exception as e:
            print(f"Error deleting document: {str(e)}")
            return False
