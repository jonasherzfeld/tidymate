// Interfaces and types used in frontend and backend
interface Todo {
  id: string;
  data: string;
  assignee: string;
  done: boolean;
  created_on: string;
  deadline: string;
}

type ChoreSeverity = {
  LOW: 0;
  MEDIUM: 1;
  HIGH: 2;
};
interface Chore extends Todo {
  frequency: number;
  last_done: string;
  room: string;
  severity: ChoreSeverity;
}

interface Reminder extends Todo {
  frequency: number;
  last_done: string;
  category: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  thumbnail: string;
  house_id: string;
  joined_on: string;
  is_admin: boolean;
}
interface House {
  id: string;
  name: string;
  city: string;
  country: string;
  created_on: string;
  join_id: string;
  members: User[];
  rooms: string[];
}

interface Notification {
  id: string;
  name: string;
  description: string;
  severity: number;
  is_viewed: boolean;
  created_on: string;
  user_id: User;
}

// Internal types
type SearchableItem<T> = T & { searchTerms: string };
type SearchableItemSortKey<T> =
  | keyof SearchableItem<T>
  | `-${string & keyof SearchableItem<T>}`;

type FilterDescription<T> = {
  property: keyof T;
  values: string[];
  selection: string[];
};

type sortArg<T> = keyof T | `-${string & keyof T}`;

type ItemListState<T> = {
  items: T[];
  filters: FilterDescription<T>[];
  searchText: string;
  sortBy: keyof Todo;
  sortOrder: "asc" | "desc";
  filteredSortedItems: T[];
};
