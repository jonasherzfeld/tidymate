import TodoIcon from 'virtual:icons/fluent/task-list-square-16-filled';
import ChoresIcon from 'virtual:icons/fluent/calendar-arrow-counterclockwise-48-filled';
import InfoIcon from 'virtual:icons/fluent/info-12-regular';
import DocsIcon from 'virtual:icons/fluent/document-bullet-list-16-regular';
import UserCircleOutline from '~icons/mdi/user-circle-outline';
import HouseCircleOutline from '~icons/mdi/house-circle-outline';
import SignOut from 'virtual:icons/mdi/sign-out';
import SignIn from 'virtual:icons/mdi/sign-in';
import RegisterIcon from 'virtual:icons/mdi/register-outline';
import HouseIcon from 'virtual:icons/fluent/home-20-filled';
import type { Component } from 'svelte';

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

export type RouteLinkPosition =
    | 'header_left'
    | 'header_right'
    | 'drawer_top'
    | 'drawer_bottom'
    | 'menu'
    | 'avatar_dropdown';
export type RestrictionType =
    | 'none'
    | 'logged_in'
    | 'logged_out'
    | 'house_member'
    | 'no_house_member';
export type RouteMap = {
    url: string;
    title: string;
    position: RouteLinkPosition[];
    icon: Component;
    restricted: RestrictionType;
    target: '_blank' | '_self' | '';
};

export const ROUTE_MAPPING: RouteMap[] = [
    {
        url: '/home',
        title: 'Home',
        position: ['menu'],
        icon: HouseIcon,
        restricted: 'house_member',
        target: ''
    },
    {
        url: '/home/todo',
        title: 'Todos',
        position: ['header_left', 'drawer_top', 'menu'],
        icon: TodoIcon,
        restricted: 'house_member',
        target: ''
    },
    {
        url: '/home/chores',
        title: 'Chores',
        position: ['header_left', 'drawer_top', 'menu'],
        icon: ChoresIcon,
        restricted: 'house_member',
        target: ''
    },
    {
        url: '/about',
        title: 'About',
        position: ['header_right', 'drawer_bottom'],
        icon: DocsIcon,
        restricted: 'none',
        target: ''
    },
    {
        url: 'https://tidymate-docs.vercel.app/',
        title: 'Documentation',
        position: ['header_right', 'drawer_bottom'],
        icon: InfoIcon,
        restricted: 'none',
        target: '_blank'
    },
    {
        url: '/profile/user',
        title: 'Your Profile',
        position: ['avatar_dropdown'],
        icon: UserCircleOutline,
        restricted: 'logged_in',
        target: ''
    },
    {
        url: '/profile/house',
        title: 'Your House',
        position: ['avatar_dropdown'],
        icon: HouseCircleOutline,
        restricted: 'house_member',
        target: ''
    },
    {
        url: '/auth/login',
        title: 'Login',
        position: ['avatar_dropdown'],
        icon: SignIn,
        restricted: 'logged_out',
        target: ''
    },
    {
        url: '/auth/register/house',
        title: 'Register House',
        position: ['avatar_dropdown'],
        icon: RegisterIcon,
        restricted: 'no_house_member',
        target: ''
    },
    {
        url: '/auth/register',
        title: 'Register',
        position: ['avatar_dropdown'],
        icon: InfoIcon,
        restricted: 'logged_out',
        target: ''
    },
    {
        url: '/auth/logout',
        title: 'Logout',
        position: ['avatar_dropdown'],
        icon: SignOut,
        restricted: 'logged_in',
        target: '_self'
    }
];
