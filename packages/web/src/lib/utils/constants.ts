export const BASE_API_URI = import.meta.env.VITE_BASE_API_URI;
export const PROTECTED_ROUTES_USER = ['/auth/logout', '/profile', '/home', '/auth/register/house'];
export const PROTECTED_ROUTES_HOUSE = ['/profile/house', '/home'];

export type HeaderMap = {
    key: string;
    title: string;
};
export const HEADER_MAPPING: HeaderMap[] = [
    { key: '/home', title: '' },
    { key: '/home/todo', title: 'Todos' },
    { key: '/home/chores', title: 'Chores' },
    { key: '/profile/user', title: 'Your Profile' },
    { key: '/profile/house', title: 'Your House' },
    { key: '/auth/login', title: 'Login' },
    { key: '/auth/register/house', title: 'Register House' },
    { key: '/auth/register/user', title: 'Register' },
    { key: '/auth/logout', title: 'Logout' }
];
