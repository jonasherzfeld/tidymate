from google.cloud.firestore_v1.base_query import FieldFilter

from db.database import db
from models.models import Todo, User, House, Chore

USER_COLLECTION: str = "user"
HOUSE_COLLECTION: str = "house"
TODOS_COLLECTION: str = "todos"
CHORES_COLLECTION: str = "chores"
STATS_COLLECTION: str = "stats"


class Statistics():
    STAT_OPEN: str = "open"
    STAT_COMPLETED: str = "completed"
    STAT_USER: str = "user"


class BaseViewModel():

    def get_data(self, doc_ref):
        doc = doc_ref.get()
        if doc.exists:
            doc_data = doc.to_dict()
            if doc_data is None or not doc_data.get("id", ""):
                return None
            return doc_data
        else:
            print("Document not found")
            return None

    def set_data(self, doc_ref, data) -> bool:
        doc_ref.set(data.to_json())
        if doc_ref.get().exists:
            return True
        else:
            print("Document could not be set collection")
            return False

    def update_data(self, doc_ref, data) -> bool:
        if doc_ref.get().exists:
            doc_ref.update(data.to_json())
            return True
        else:
            print("Document not found in collection")
            return False

    def delete_data(self, doc_ref) -> bool:
        try:
            doc_ref.delete()
            return True
        except Exception as e:
            print(f"Error deleting document: {str(e)}")
            return False


class ChoreViewModel(BaseViewModel):

    def get(self, house_id: str, chore_id: str) -> Chore:
        doc_ref = db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(CHORES_COLLECTION).document(chore_id)
        data = self.get_data(doc_ref)
        if data is not None:
            return Chore().from_json(data)
        return None

    def get_all(self, house_id: str) -> list:
        docs = (
            db.collection(HOUSE_COLLECTION).document(house_id)
            .collection(CHORES_COLLECTION).stream()
        )

        chore_list = list()
        for doc in docs:
            doc_data = doc.to_dict()
            if doc_data is None or not doc_data.get("id", ""):
                return None
            chore = Chore().from_json(doc_data)
            chore_list.append(chore)

        return chore_list

    def set(self, house_id: str, chore: Chore) -> bool:
        doc_ref = db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(CHORES_COLLECTION).document(chore.id)
        return self.set_data(doc_ref, chore)

    def update(self, house_id: str, chore: Chore) -> bool:
        doc_ref = db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(CHORES_COLLECTION).document(chore.id)
        return self.update_data(doc_ref, chore)

    def delete(self, house_id: str, chore_id: str) -> bool:
        doc_ref = db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(CHORES_COLLECTION).document(chore_id)
        return self.delete_data(doc_ref)


class TodoViewModel(BaseViewModel):

    def get(self, house_id: str, todo_id: str) -> Todo:
        doc_ref = db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(TODOS_COLLECTION).document(todo_id)
        data = self.get_data(doc_ref)
        if data is not None:
            return Todo().from_json(data)
        return None

    def get_all(self, house_id: str) -> list:
        docs = (
            db.collection(HOUSE_COLLECTION).document(house_id)
            .collection(TODOS_COLLECTION).stream())

        todo_list = list()
        for doc in docs:
            doc_data = doc.to_dict()
            if doc_data is None or not doc_data.get("id", ""):
                return None
            todo = Todo().from_json(doc_data)
            todo_list.append(todo)

        return todo_list

    def set(self, house_id: str, todo_id: str, data: Todo) -> bool:
        doc_ref = db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(TODOS_COLLECTION).document(todo_id)
        return self.set_data(doc_ref, data)

    def update(self, house_id: str, todo_id: str, todo: Todo) -> bool:
        doc_ref = db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(TODOS_COLLECTION).document(todo_id)
        return self.update_data(doc_ref, todo)

    def delete(self, house_id: str, todo_id: str) -> bool:
        doc_ref = db.collection(HOUSE_COLLECTION).document(house_id) \
                    .collection(TODOS_COLLECTION).document(todo_id)
        return self.delete_data(doc_ref)


class HouseViewModel():

    def get(self, id: int) -> User:
        doc_ref = db.collection(HOUSE_COLLECTION).document(id)
        doc = doc_ref.get()
        if doc.exists:
            doc_data = doc.to_dict()
            if doc_data is None or not doc_data.get("id", ""):
                return None
            return House().from_json(doc_data)
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
                if doc_data is None or not doc_data.get("id", ""):
                    return None
                house = House().from_json(doc_data)
                doc_list.append(house)

            return doc_list
        except Exception as e:
            print(f"Error retrieving documents: {str(e)}")
            return None

    def set(self, id: str, data: House) -> bool:
        doc_ref = db.collection(HOUSE_COLLECTION).document(id)
        doc_ref.set(data.to_json())
        if doc_ref.get().exists:
            return True
        else:
            print(f"Document could not be set collection {HOUSE_COLLECTION}")
            return False

    def update(self, id: str, data: House) -> bool:
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

    def add_stats(self, id: str, stats: any) -> bool:
        data_ref: str = None
        if type(stats) is Todo:
            data_ref = ""
        elif type(stats) is Chore:
            pass
        doc_ref = db.collection(HOUSE_COLLECTION).document(id)
        doc = doc_ref.get()
        if doc.exists:
            doc_data = doc.to_dict()
            doc_data["stats"].append(stats)
            doc_ref.update(doc_data.to_json())
            return True
        else:
            print(f"Document {id} not found in collection {HOUSE_COLLECTION}")
            return False


class UserViewModel():

    def get(self, id: int) -> User:
        doc_ref = db.collection(USER_COLLECTION).document(id)
        doc = doc_ref.get()
        if doc.exists:
            doc_data = doc.to_dict()
            if not doc_data or not doc_data.get("id", ""):
                return None
            return User().from_json(doc_data)
        else:
            print(f"Document {id} not found in collection {USER_COLLECTION}")
            return None

    def filter(self, filter_field: str, data: str) -> list:
        try:
            doc_ref = db.collection(USER_COLLECTION)
            query = doc_ref.where(filter=FieldFilter(filter_field, "==", data))
            docs = query.stream()

            doc_list = list()
            for doc in docs:
                doc_data = doc.to_dict()
                if doc_data is None or not doc_data.get("id", ""):
                    return None
                user = User().from_json(doc_data)
                doc_list.append(user)

            return doc_list
        except Exception as e:
            print(f"Error retrieving documents: {str(e)}")
            return None

    def set(self, id: str, data: User) -> bool:
        doc_ref = db.collection(USER_COLLECTION).document(id)
        doc_ref.set(data.to_json())
        if doc_ref.get().exists:
            return True
        else:
            print(f"Document could not be set collection {USER_COLLECTION}")
            return False

    def update(self, id: str, data: User) -> bool:
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
