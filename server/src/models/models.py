from enum import Enum
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.declarative import declared_attr

from db.db import db, bcrypt


class ChoreSeverity(Enum):
    LOW = 0
    MEDIUM = 1
    HIGH = 2

    @staticmethod
    def from_int(severity: int) -> 'ChoreSeverity':
        try:
            output = ChoreSeverity(severity)
        except BaseException:
            output = None
        return output


class NotificationSeverity(Enum):
    DETAIL = 0
    INFO = 1
    WARN = 2
    ERROR = 3

    @staticmethod
    def from_int(severity: int) -> 'NotificationSeverity':
        try:
            output = NotificationSeverity(severity)
        except BaseException:
            output = None
        return output


class Users(db.Model, SerializerMixin):
    id = db.Column("id", db.String, primary_key=True)
    email = db.Column("email", db.String(30), nullable=False, unique=True)
    _password_hash = db.Column("password_hash", db.String(100), nullable=False)
    thumbnail = db.Column("thumbnail", db.String(300))
    first_name = db.Column("first_name", db.String(100))
    last_name = db.Column("last_name", db.String(100))
    joined_on = db.Column("joined_on", db.String(100))
    is_admin = db.Column("is_admin", db.Boolean, default=False)
    house_id = db.Column("house_id", db.Integer, db.ForeignKey('house.id'))
    house = db.relationship('House', back_populates='members')
    reminders = db.relationship('Reminder', back_populates='user')
    notifications = db.relationship('Notification', back_populates='user')

    def __init__(self, id, email, password, first_name, last_name,
                 joined_on, is_admin, house):
        self.id = id
        self.email = email
        self.password_hash = password
        self.first_name = first_name
        self.last_name = last_name
        self.joined_on = joined_on
        self.is_admin = is_admin
        self.house_id = house.id if house else None
        self.house = house

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    # this prevents that Exception being raised everytime we try to call the
    # .to_dict() method in a request that returns information from users
    serialize_rules = (
        '-_password_hash',
        '-house.members',
        '-house.chores',
        '-house.todos',
        '-reminders.user',
        '-notifications.user')


class House(db.Model, SerializerMixin):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    join_id = db.Column(db.String(100))
    created_on = db.Column(db.String(100))
    rooms = db.Column(db.String(100))
    members = db.relationship('Users', back_populates='house')
    chores = db.relationship('Chore', back_populates='house')
    todos = db.relationship('Todo', back_populates='house')

    serialize_rules = ('-members.house', '-chores.house', '-todos.house')


class BaseItem(object):
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    @declared_attr
    def id(cls):
        return db.Column(db.String, primary_key=True)

    @declared_attr
    def data(cls):
        return db.Column(db.String(255))

    @declared_attr
    def assignee(cls):
        return db.Column(db.String(100))

    @declared_attr
    def done(cls):
        return db.Column(db.Boolean, default=False)

    @declared_attr
    def created_on(cls):
        return db.Column(db.String(100))

    @declared_attr
    def deadline(cls):
        return db.Column(db.String(100))


class Todo(BaseItem, db.Model, SerializerMixin):
    house_id = db.Column(db.Integer, db.ForeignKey('house.id'))
    house = db.relationship('House', back_populates='todos')
    serialize_rules = ('-house.todos', '-house.members', '-house.chores')


class Chore(BaseItem, db.Model, SerializerMixin):
    frequency = db.Column(db.Integer)
    last_done = db.Column(db.String(100))
    room = db.Column(db.String(100))
    severity = db.Column(db.Enum(ChoreSeverity))
    house_id = db.Column(db.Integer, db.ForeignKey('house.id'))
    house = db.relationship('House', back_populates='chores')

    serialize_rules = ('-house.chores', '-house.members', '-house.todos')


class Reminder(BaseItem, db.Model, SerializerMixin):
    frequency = db.Column(db.Integer)
    last_done = db.Column(db.String(100))
    category = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('Users', back_populates='reminders')

    serialize_rules = ('-user.reminders',)


class Notification(db.Model, SerializerMixin):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100))
    description = db.Column(db.String(255))
    severity = db.Column(db.Enum(NotificationSeverity))
    is_viewed = db.Column(db.Boolean, default=False)
    created_on = db.Column(db.String(100))
    href = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('Users', back_populates='notifications')

    serialize_rules = ('-user.notifications',)


class EventType(Enum):
    COMPLETED = "completed"
    CREATED = "created"
    DELETED = "deleted"

    @staticmethod
    def from_string(event_type: str) -> 'EventType':
        try:
            return EventType(event_type)
        except ValueError:
            return None


class History(db.Model, SerializerMixin):
    id = db.Column(db.String, primary_key=True)
    event_type = db.Column(db.Enum(EventType), nullable=False)
    # ID of the todo/chore/reminder
    item_id = db.Column(db.String(100), nullable=False)
    # "todo", "chore", "reminder"
    item_type = db.Column(db.String(50), nullable=False)
    item_data = db.Column(db.String(255))  # Description/name of the item
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    house_id = db.Column(db.String, db.ForeignKey('house.id'), nullable=False)
    created_on = db.Column(db.String(100), nullable=False)

    user = db.relationship('Users')
    house = db.relationship('House')

    serialize_rules = ('-user.house', '-house.members')
