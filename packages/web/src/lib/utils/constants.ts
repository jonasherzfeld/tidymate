export const BASE_API_URI = import.meta.env.VITE_BASE_API_URI;
export const PROTECTED_ROUTES_USER = ['/auth/logout', '/profile', '/home', '/auth/register/house'];
export const PROTECTED_ROUTES_HOUSE = ['/profile/house', '/home'];

export const HEADER_MAPPING = {
    '/home': '',
    '/home/todo': 'Todos',
    '/home/chores': 'Chores',
    '/profile/user': 'Your Profile',
    '/profile/house': 'Your House',
    '/auth/login': 'Login',
    '/auth/register/house': 'Register House',
    '/auth/register/user': 'Register',
    '/auth/logout': 'Logout'
};
