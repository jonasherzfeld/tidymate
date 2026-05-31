import { browser } from "$app/environment";
import { PUBLIC_DEV_MODE } from "$env/static/public";
import {
  BathroomIcon,
  BedroomIcon,
  ChoresIcon,
  FinanceIcon,
  GeneralIcon,
  HealthIcon,
  HouseIcon,
  InfoIcon,
  KitchenIcon,
  LearningIcon,
  LivingRoomIcon,
  OfficeIcon,
  OutdoorIcon,
  RegisterIcon,
  ReminderIcon,
  ShoppingIcon,
  SignIn,
  SignOut,
  SocialIcon,
  TodoIcon,
  TravelIcon,
  UserCircleOutline,
  WorkIcon
} from "$lib/utils/icons";
import type { Component } from "svelte";

// Use relative URL for API base to work with Nginx proxy
// During SSR, use the internal backend URL directly
export const USE_API = PUBLIC_DEV_MODE == "True" ? false : browser;
export const BASE_API_URI = USE_API ? "/api" : "http://127.0.0.1:5001";

export const FETCH_ABORT_TIMEOUT_MS = 5000;

export const THEME_MAPPING = {
  dark: "dracula",
  light: "cupcake"
};

// Routes that are protected and need a user to be logged in
export const PROTECTED_ROUTES_USER = ["/auth/logout", "/profile", "/home", "/auth/register/house"];

// Routes that are protected and need a user to be assigned to a house
export const PROTECTED_ROUTES_HOUSE = ["/profile", "/home"];

export type HeaderMap = {
  key: string;
  title: string;
};

export type RouteLinkPosition =
  | "header_left"
  | "header_right"
  | "drawer_top"
  | "drawer_bottom"
  | "menu"
  | "avatar_dropdown";
export type RestrictionType =
  | "none"
  | "logged_in"
  | "logged_out"
  | "house_member"
  | "no_house_member";

export type PublicType = "private" | "public";

export type RouteMap = {
  url: string;
  title: string;
  position: RouteLinkPosition[];
  icon: Component;
  restricted: RestrictionType;
  publicType: PublicType;
  target: "_blank" | "_self" | "";
};

export const ROUTE_MAPPING: RouteMap[] = [
  {
    url: "/home",
    title: "Home",
    position: ["menu"],
    icon: HouseIcon,
    restricted: "house_member",
    publicType: "public",
    target: ""
  },
  {
    url: "/home/reminders",
    title: "Reminders",
    position: ["header_left", "drawer_top", "menu"],
    icon: ReminderIcon,
    restricted: "house_member",
    publicType: "private",
    target: ""
  },
  {
    url: "/home/todo",
    title: "Todos",
    position: ["header_left", "drawer_top", "menu"],
    icon: TodoIcon,
    restricted: "house_member",
    publicType: "public",
    target: ""
  },
  {
    url: "/home/chores",
    title: "Chores",
    position: ["header_left", "drawer_top", "menu"],
    icon: ChoresIcon,
    restricted: "house_member",
    publicType: "public",
    target: ""
  },
  {
    url: "https://jonasherzfeld.github.io/tidymate/",
    title: "Documentation",
    position: ["drawer_bottom"],
    icon: InfoIcon,
    restricted: "none",
    publicType: "public",
    target: "_blank"
  },
  {
    url: "/profile",
    title: "Settings",
    position: ["avatar_dropdown"],
    icon: UserCircleOutline,
    restricted: "logged_in",
    publicType: "public",
    target: ""
  },
  {
    url: "/auth/login",
    title: "Login",
    position: ["avatar_dropdown"],
    icon: SignIn,
    restricted: "logged_out",
    publicType: "public",
    target: ""
  },
  {
    url: "/auth/register/house",
    title: "Register House",
    position: ["avatar_dropdown"],
    icon: RegisterIcon,
    restricted: "no_house_member",
    publicType: "public",
    target: ""
  },
  {
    url: "/auth/register",
    title: "Register",
    position: ["avatar_dropdown"],
    icon: RegisterIcon,
    restricted: "logged_out",
    publicType: "public",
    target: ""
  },
  {
    url: "/auth/logout",
    title: "Logout",
    position: ["avatar_dropdown"],
    icon: SignOut,
    restricted: "logged_in",
    publicType: "public",
    target: "_self"
  }
];

export type FrequencyOption = {
  value: number;
  description: string;
};

export const FREQUENCY_INTERVALS: FrequencyOption[] = [
  { value: 1, description: "Daily" },
  { value: 2, description: "Every other day" },
  { value: 3, description: "Every three days" },
  { value: 4, description: "Every four days" },
  { value: 5, description: "Every five days" },
  { value: 6, description: "Every six days" },
  { value: 7, description: "Weekly" },
  { value: 10, description: "Every ten days" },
  { value: 14, description: "Every other week" },
  { value: 21, description: "Every three weeks" },
  { value: 28, description: "Monthly" },
  { value: 35, description: "Every five weeks" },
  { value: 42, description: "Every six weeks" },
  { value: 56, description: "Every two months" },
  { value: 84, description: "Every three months" },
  { value: 112, description: "Every four months" },
  { value: 182, description: "Every six months" },
  { value: 365, description: "Yearly" }
];

export type CategoryConfig = {
  id: number;
  name: string;
  icon: Component;
  /** Legacy solid-bg class — still used in a few places; prefer `tint`. */
  color: string;
  /** Soft tinted classes for modern chips: bg + text + ring, with dark variants. */
  tint: string;
  /** rgba color used by chart.js datasets. */
  rgba_color: string;
};

const TINT = {
  stone:
    "bg-stone-100 text-stone-700 ring-stone-200 dark:bg-stone-800/60 dark:text-stone-100 dark:ring-stone-700",
  sky: "bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:ring-sky-800",
  amber:
    "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-800",
  violet:
    "bg-violet-100 text-violet-700 ring-violet-200 dark:bg-violet-900/40 dark:text-violet-200 dark:ring-violet-800",
  emerald:
    "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-800",
  rose: "bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:ring-rose-800",
  green:
    "bg-green-100 text-green-800 ring-green-200 dark:bg-green-900/40 dark:text-green-200 dark:ring-green-800",
  indigo:
    "bg-indigo-100 text-indigo-700 ring-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:ring-indigo-800"
} as const;

export const ROOM_CONFIG: CategoryConfig[] = [
  {
    id: 0,
    name: "General",
    icon: GeneralIcon,
    color: "bg-stone-500",
    tint: TINT.stone,
    rgba_color: "rgba(120, 113, 108, 0.65)"
  },
  {
    id: 1,
    name: "Bathroom",
    icon: BathroomIcon,
    color: "bg-sky-500",
    tint: TINT.sky,
    rgba_color: "rgba(14, 165, 233, 0.65)"
  },
  {
    id: 2,
    name: "Bedroom",
    icon: BedroomIcon,
    color: "bg-amber-400",
    tint: TINT.amber,
    rgba_color: "rgba(245, 158, 11, 0.65)"
  },
  {
    id: 3,
    name: "Kitchen",
    icon: KitchenIcon,
    color: "bg-violet-500",
    tint: TINT.violet,
    rgba_color: "rgba(139, 92, 246, 0.65)"
  },
  {
    id: 4,
    name: "Living Room",
    icon: LivingRoomIcon,
    color: "bg-emerald-500",
    tint: TINT.emerald,
    rgba_color: "rgba(16, 185, 129, 0.65)"
  },
  {
    id: 5,
    name: "Office",
    icon: OfficeIcon,
    color: "bg-rose-400",
    tint: TINT.rose,
    rgba_color: "rgba(244, 114, 182, 0.65)"
  },
  {
    id: 6,
    name: "Outdoor",
    icon: OutdoorIcon,
    color: "bg-green-700",
    tint: TINT.green,
    rgba_color: "rgba(34, 197, 94, 0.65)"
  },
  {
    id: 7,
    name: "House",
    icon: HouseIcon,
    color: "bg-indigo-700",
    tint: TINT.indigo,
    rgba_color: "rgba(99, 102, 241, 0.65)"
  }
];

export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    id: 0,
    name: "General",
    icon: GeneralIcon,
    color: "bg-stone-500",
    tint: TINT.stone,
    rgba_color: "rgba(120, 113, 108, 0.65)"
  },
  {
    id: 1,
    name: "Social",
    icon: SocialIcon,
    color: "bg-sky-500",
    tint: TINT.sky,
    rgba_color: "rgba(14, 165, 233, 0.65)"
  },
  {
    id: 2,
    name: "Learning",
    icon: LearningIcon,
    color: "bg-amber-400",
    tint: TINT.amber,
    rgba_color: "rgba(245, 158, 11, 0.65)"
  },
  {
    id: 3,
    name: "Work",
    icon: WorkIcon,
    color: "bg-violet-500",
    tint: TINT.violet,
    rgba_color: "rgba(139, 92, 246, 0.65)"
  },
  {
    id: 4,
    name: "Health",
    icon: HealthIcon,
    color: "bg-emerald-500",
    tint: TINT.emerald,
    rgba_color: "rgba(16, 185, 129, 0.65)"
  },
  {
    id: 5,
    name: "Finance",
    icon: FinanceIcon,
    color: "bg-rose-400",
    tint: TINT.rose,
    rgba_color: "rgba(244, 114, 182, 0.65)"
  },
  {
    id: 6,
    name: "Shopping",
    icon: ShoppingIcon,
    color: "bg-indigo-700",
    tint: TINT.indigo,
    rgba_color: "rgba(99, 102, 241, 0.65)"
  },
  {
    id: 7,
    name: "Travel",
    icon: TravelIcon,
    color: "bg-green-700",
    tint: TINT.green,
    rgba_color: "rgba(34, 197, 94, 0.65)"
  }
];
