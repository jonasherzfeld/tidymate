import {
  BathroomIcon,
  BedroomIcon,
  ChoresIcon,
  GeneralIcon,
  HouseCircleOutline,
  HouseIcon,
  InfoIcon,
  KitchenIcon,
  LivingRoomIcon,
  OfficeIcon,
  OutdoorIcon,
  RegisterIcon,
  ReminderIcon,
  SignIn,
  SignOut,
  TodoIcon,
  UserCircleOutline
} from "$lib/utils/icons";
import type { Component } from "svelte";
import { browser } from "$app/environment";

// Use relative URL for API base to work with Nginx proxy
// During SSR, use the internal backend URL directly
export const BASE_API_URI = browser ? "/api" : "http://127.0.0.1:5001";

export const FETCH_ABORT_TIMEOUT_MS = 5000;

export const THEME_MAPPING = {
  dark: "dracula",
  light: "cupcake"
};

// Routes that are protected and need a user to be logged in
export const PROTECTED_ROUTES_USER = [
  "/auth/logout",
  "/profile",
  "/home",
  "/auth/register/house"
];

// Routes that are protected and need a user to be assigned to a house
export const PROTECTED_ROUTES_HOUSE = ["/profile/house", "/home"];

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
    url: "/profile/user",
    title: "Your Profile",
    position: ["avatar_dropdown"],
    icon: UserCircleOutline,
    restricted: "logged_in",
    publicType: "public",
    target: ""
  },
  {
    url: "/profile/house",
    title: "Your House",
    position: ["avatar_dropdown"],
    icon: HouseCircleOutline,
    restricted: "house_member",
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
  color: string;
  rgba_color: string;
};
export const ROOM_CONFIG: CategoryConfig[] = [
  {
    id: 0,
    name: "General",
    icon: GeneralIcon,
    color: "bg-stone-500",
    rgba_color: "rgba(120, 113, 108, 0.6)"
  },
  {
    id: 1,
    name: "Bathroom",
    icon: BathroomIcon,
    color: "bg-blue-500",
    rgba_color: "rgba(59, 130, 246, 0.6)"
  },
  {
    id: 2,
    name: "Bedroom",
    icon: BedroomIcon,
    color: "bg-amber-400",
    rgba_color: "rgba(255, 185, 0, 0.6)"
  },
  {
    id: 3,
    name: "Kitchen",
    icon: KitchenIcon,
    color: "bg-violet-500",
    rgba_color: "rgba(139, 92, 246, 0.6)"
  },
  {
    id: 4,
    name: "Living Room",
    icon: LivingRoomIcon,
    color: "bg-lime-400",
    rgba_color: "rgba(163, 230, 53, 0.6)"
  },
  {
    id: 5,
    name: "Office",
    icon: OfficeIcon,
    color: "bg-rose-400",
    rgba_color: "rgba(251, 113, 133, 0.6)"
  },
  {
    id: 6,
    name: "Outdoor",
    icon: OutdoorIcon,
    color: "bg-green-700",
    rgba_color: "rgba(21, 128, 61, 0.6)"
  },
  {
    id: 7,
    name: "House",
    icon: HouseIcon,
    color: "bg-indigo-700",
    rgba_color: "rgba(48, 63, 159, 0.6)"
  }
];

export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    id: 0,
    name: "General",
    icon: GeneralIcon,
    color: "bg-stone-500",
    rgba_color: "rgba(120, 113, 108, 0.6)"
  },
  {
    id: 1,
    name: "Social",
    icon: GeneralIcon,
    color: "bg-blue-500",
    rgba_color: "rgba(59, 130, 246, 0.6)"
  },
  {
    id: 2,
    name: "Learning",
    icon: GeneralIcon,
    color: "bg-amber-400",
    rgba_color: "rgba(255, 185, 0, 0.6)"
  },
  {
    id: 3,
    name: "Work",
    icon: GeneralIcon,
    color: "bg-violet-500",
    rgba_color: "rgba(139, 92, 246, 0.6)"
  },
  {
    id: 4,
    name: "Health",
    icon: GeneralIcon,
    color: "bg-lime-400",
    rgba_color: "rgba(163, 230, 53, 0.6)"
  },
  {
    id: 5,
    name: "Finance",
    icon: GeneralIcon,
    color: "bg-rose-400",
    rgba_color: "rgba(251, 113, 133, 0.6)"
  },
  {
    id: 6,
    name: "Shopping",
    icon: GeneralIcon,
    color: "bg-indigo-700",
    rgba_color: "rgba(48, 63, 159, 0.6)"
  },
  {
    id: 7,
    name: "Travel",
    icon: GeneralIcon,
    color: "bg-green-700",
    rgba_color: "rgba(21, 128, 61, 0.6)"
  }
];
