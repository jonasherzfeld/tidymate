// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

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

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: User;
            house: House;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
