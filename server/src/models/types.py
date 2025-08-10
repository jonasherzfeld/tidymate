from enum import Enum


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


class NotificationType(Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    ITEM_DUE = "item_due"

    @staticmethod
    def from_string(notification_type: str) -> 'NotificationType':
        try:
            return NotificationType(notification_type)
        except ValueError:
            return None


class ItemType(Enum):
    NONE = "none"
    TODO = "todo"
    CHORE = "chore"
    REMINDER = "reminder"

    @staticmethod
    def from_string(item_type: str) -> 'ItemType':
        try:
            return ItemType(item_type)
        except ValueError:
            return None


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
