from google.cloud.firestore_v1.base_query import FieldFilter, Or

class Database():
    def __init__(self, db):
        self.db = db

    def get_all_data(self, collection: str):
        docs = (
            self.db.collection(collection).stream()
        )

        doc_list = list()
        for doc in docs:
            doc_data = doc.to_dict()
            doc_data['id'] = doc.id
            doc_data['data'] = doc._data

            doc_list.append(doc_data)

        return doc_list

    def get_all_data_filter(self, collection: str, filter: str, value: str):
        try:
            doc_ref = self.db.collection(collection)
            query = doc_ref.where(filter=FieldFilter(filter, "==", value))
            docs = query.stream()

            doc_list = list()
            for doc in docs:
                doc_data = doc.to_dict()
                doc_data['id'] = doc.id
                doc_data['data'] = doc._data

                doc_list.append(doc_data)

            return doc_list
        except Exception as e:
            print(f"Error retrieving documents: {str(e)}")
            return None

    def get_data_by_id(self, collection: str, id: str):
        doc_ref = self.db.collection(collection).document(id)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            print(f"Document {id} not found in collection {collection}")
            return None

    def set_data(self, collection: str, data: dict):
        doc_ref = self.db.collection(collection).document()
        doc_ref.set(data)

    def update_data(self, collection: str, id: str, new_data):
        doc_ref = self.db.collection(collection).document(id)
        doc_ref.update(new_data)

    def delete_data(self, collection: str, id: str):
        try:
            doc_ref = self.db.collection(collection).document(id)
            doc_ref.delete()
            return True
        except Exception as e:
            print(f"Error deleting document: {str(e)}")
            return False
