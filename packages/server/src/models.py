USER_COLLECTION : str = "user"
NOTES_COLLECTION : str = "notes"

class Note():
    id : str = None
    data : str = None
    date : str = None

    def __init__(self, id: str = None, data: str = None, date: str = None):
        self.id = id
        self.data = data
        self.date = date

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "data": self.data,
            "date": self.date
        }

class User():
    id : str = None
    email : str = None
    first_name : str = None
    last_name : str = None
    joined_on : str = None

    def __init__(self, id: str = None, email: str = None, first_name: str = None,
                 last_name: str = None, joined_on: str = None):
        self.id = id
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.joined_on = joined_on

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "joined_on": self.joined_on,
        }