// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

interface User {
    email: string;
    first_name: string;
    last_name: string;
    id: string;
    thumbnail: string;
    house_id: UserProfile;
}
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: User;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
