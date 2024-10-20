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
    house_id : str = None
    is_admin : bool = False

    def __init__(self, id: str = None, email: str = None, first_name: str = None,
                 last_name: str = None, joined_on: str = None, house_id: str = None,
                 thumbnail: str = None, is_admin: bool = False):
        self.id = id
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.joined_on = joined_on
        self.house_id = house_id
        self.thumbnail = thumbnail
        self.is_admin = is_admin

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "joined_on": self.joined_on,
            "house_id": self.house_id,
            "thumbnail": self.thumbnail,
            "is_admin": self.is_admin
        }


class House():
    id : str = None
    name : str = None
    city : str = None
    country : str = None
    created_on : str = None
    join_id : str = None
    members : list = None

    def __init__(self, id: str = None, name: str = None, city: str = None,
                 country: str = None, created_on: str = None, join_id: str = None,
                 members: list = None):
        self.id = id
        self.name = name
        self.city = city
        self.country = country
        self.created_on = created_on
        self.join_id = join_id
        self.members = members

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "city": self.city,
            "country": self.country,
            "created_on": self.created_on,
            "members": self.members,
            "join_id": self.join_id,
        }