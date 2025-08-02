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
  StatisticsIcon,
  TodoIcon,
  UserCircleOutline
} from "$lib/utils/icons";
import type { Component } from "svelte";

export const BASE_API_URI = "http://127.0.0.1:5000";

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
  | "menu_left"
  | "menu_mid"
  | "menu_right"
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
    position: ["menu_mid"],
    icon: HouseIcon,
    restricted: "house_member",
    publicType: "public",
    target: ""
  },

  {
    url: "/home/history",
    title: "History",
    position: [],
    icon: HouseIcon,
    restricted: "house_member",
    publicType: "public",
    target: ""
  },
  {
    url: "/home/stats",
    title: "Statistics",
    position: ["drawer_top", "menu_left"],
    icon: StatisticsIcon,
    restricted: "house_member",
    publicType: "public",
    target: ""
  },
  {
    url: "/home/reminders",
    title: "Reminders",
    position: ["header_left", "drawer_top", "menu_left"],
    icon: ReminderIcon,
    restricted: "house_member",
    publicType: "private",
    target: ""
  },
  {
    url: "/home/todo",
    title: "Todos",
    position: ["header_left", "drawer_top", "menu_right"],
    icon: TodoIcon,
    restricted: "house_member",
    publicType: "public",
    target: ""
  },
  {
    url: "/home/chores",
    title: "Chores",
    position: ["header_left", "drawer_top", "menu_right"],
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
  name: string;
  icon: Component;
  color: string;
};
export const ROOM_CONFIG: CategoryConfig[] = [
  { name: "General", icon: GeneralIcon, color: "bg-stone-500" },
  { name: "Bathroom", icon: BathroomIcon, color: "bg-blue-500" },
  { name: "Bedroom", icon: BedroomIcon, color: "bg-amber-400" },
  { name: "Kitchen", icon: KitchenIcon, color: "bg-violet-500" },
  { name: "Living Room", icon: LivingRoomIcon, color: "bg-lime-400" },
  { name: "Office", icon: OfficeIcon, color: "bg-rose-400" },
  { name: "Outdoor", icon: OutdoorIcon, color: "bg-indogo-700" },
  { name: "House", icon: HouseIcon, color: "bg-primary" }
];

export const CATEGORY_CONFIG: CategoryConfig[] = [
  { name: "General", icon: GeneralIcon, color: "bg-stone-500" },
  { name: "Social", icon: GeneralIcon, color: "bg-blue-500" },
  { name: "Learning", icon: GeneralIcon, color: "bg-amber-400" },
  { name: "Work", icon: GeneralIcon, color: "bg-violet-500" },
  { name: "Health", icon: GeneralIcon, color: "bg-lime-400" },
  { name: "Finance", icon: GeneralIcon, color: "bg-rose-400" },
  { name: "Shopping", icon: GeneralIcon, color: "bg-indogo-700" },
  { name: "Travel", icon: GeneralIcon, color: "bg-primary" }
];
