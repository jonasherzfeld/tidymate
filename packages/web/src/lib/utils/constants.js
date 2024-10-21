export const BASE_API_URI = import.meta.env.VITE_BASE_API_URI;
export const PROTECTED_ROUTES_USER = ['/auth/logout', '/profile', '/home', '/auth/register/group'];
export const PROTECTED_ROUTES_HOUSE = ['/profile/house', '/home'];

export const NAV_LINKS = [
    { title: 'Home', href: '/home' },
    { title: 'Todo', href: '/home/todo' },
    { title: 'Chores', href: '/home/chores' }
];

export const INFO_LINKS = [
    { title: 'About', href: '/about' },
    { title: 'Documention ↗', href: 'https://tidymate-docs.vercel.app' }
];
