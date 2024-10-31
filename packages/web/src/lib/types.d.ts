interface User {
    email: string;
    first_name: string;
    last_name: string;
    id: string;
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
    members: string[];
}

type FieldsError = {
    email?: String,
    password?: String,
    confirmPassword?: String,
    joinId?: String
}
