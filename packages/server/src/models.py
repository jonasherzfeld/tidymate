from enum import Enum


class ChoreSeverity(Enum):
    LOW = 0
    MEDIUM = 1
    HIGH = 2

    def from_int(severity: int) -> 'ChoreSeverity':
        try:
            output = ChoreSeverity(severity)
        except:
            output = None
        return output


class Todo():
    id: str = ""
    data: str = ""
    assignee: str = ""
    done = False
    tags: list = []
    created_on: str = ""
    deadline: str = ""

    def __init__(self, id: str = None, data: str = None, assignee: str = None, done=False,
                 tags: list = None, created_on: str = None, deadline: str = None):
        self.id = id
        self.data = data
        self.assignee = assignee
        self.done = done
        self.tags = tags
        self.created_on = created_on
        self.deadline = deadline

    def from_json(self, data: dict):
        self.id = data.get("id", "")
        self.data = data.get("data", "")
        self.assignee = data.get("assignee", "")
        self.done = data.get("done", False)
        self.tags = data.get("tags", [])
        self.created_on = data.get("created_on", "")
        self.deadline = data.get("deadline", "")
        return self

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "data": self.data,
            "assignee": self.assignee,
            "done": self.done,
            "tags": self.tags,
            "created_on": self.created_on,
            "deadline": self.deadline
        }


class Chore(Todo):
    frequency: int = 0  # Days
    last_done: str = ""
    room: str = ""
    severity: int = ChoreSeverity.LOW

    def __init__(self, id: str = None, data: str = None, assignee: str = None,
                 done=False, tags: list = None, created_on: str = None, deadline: str = None,
                 frequency: int = None, last_done: str = None, room: str = None,
                 severity: ChoreSeverity = None):
        super().__init__(id, data, assignee, done, tags, created_on, deadline)
        self.frequency = frequency
        self.last_done = last_done
        self.room = room
        self.severity = severity

    def from_json(self, data: dict):
        self.id = data.get("id", "")
        self.data = data.get("data", "")
        self.assignee = data.get("assignee", "")
        self.tags = data.get("tags", [])
        self.created_on = data.get("created_on", "")
        self.deadline = data.get("deadline", "")
        self.frequency = data.get("frequency", 0)
        self.last_done = data.get("last_done", "")
        self.room = data.get("room", "")
        self.severity = ChoreSeverity.from_int(data.get("severity", 0))
        return self

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "data": self.data,
            "assignee": self.assignee,
            "tags": self.tags,
            "created_on": self.created_on,
            "deadline": self.deadline,
            "frequency": self.frequency,
            "last_done": self.last_done,
            "room": self.room,
            "severity": self.severity.value if self.severity else 0
        }


class User():
    id: str = ""
    email: str = ""
    first_name: str = ""
    last_name: str = ""
    joined_on: str = ""
    house_id: str = ""
    is_admin: bool = False

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

    def from_json(self, data: dict):
        self.id = data.get("id", "")
        self.email = data.get("email", "")
        self.first_name = data.get("first_name", "")
        self.last_name = data.get("last_name", "")
        self.joined_on = data.get("joined_on", "")
        self.house_id = data.get("house_id", "")
        self.thumbnail = data.get("thumbnail", "")
        self.is_admin = data.get("is_admin", False)
        return self

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
    id: str = ""
    name: str = ""
    city: str = ""
    country: str = ""
    created_on: str = ""
    join_id: str = ""
    members: list = []
    rooms: list = []

    def __init__(self, id: str = None, name: str = None, city: str = None,
                 country: str = None, created_on: str = None, join_id: str = None,
                 members: list = None, rooms: list = None):
        self.id = id
        self.name = name
        self.city = city
        self.country = country
        self.created_on = created_on
        self.join_id = join_id
        self.members = members
        self.rooms = rooms

    def from_json(self, data: dict):
        self.id = data.get("id", "")
        self.name = data.get("name", "")
        self.city = data.get("city", "")
        self.country = data.get("country", "")
        self.created_on = data.get("created_on", "")
        self.join_id = data.get("join_id", "")
        self.members = data.get("members", [])
        self.rooms = data.get("rooms", [])
        return self

    def to_json(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "city": self.city,
            "country": self.country,
            "created_on": self.created_on,
            "members": self.members,
            "join_id": self.join_id,
            "rooms": self.rooms
        }
