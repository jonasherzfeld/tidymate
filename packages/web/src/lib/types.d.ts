// Interfaces and types used in frontend and backend
interface Todo {
    id: string;
    data: string;
    assignee: string;
    done: boolean;
    tags: string[];
    created_on: string;
    deadline: string;
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
}

// Internal types
type SearchableTodo = Todo & { searchTerms: string };
type SearchableTodoSortKey = keyof SearchableTodo | `-${string & keyof SearchableTodo}`;

type FilterDescription<T> = {
    property: keyof T;
    values: string[];
    filterValues: string[];
};

type sortArg<T> = keyof T | `-${string & keyof T}`;
