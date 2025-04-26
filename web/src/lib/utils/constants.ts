import {
  BathroomIcon,
  BedroomIcon,
  ChoresIcon,
  DocsIcon,
  GeneralIcon,
  HouseCircleOutline,
  HouseIcon,
  InfoIcon,
  KitchenIcon,
  LivingRoomIcon,
  OfficeIcon,
  OutdoorIcon,
  RegisterIcon,
  SignIn,
  SignOut,
  TodoIcon,
  UserCircleOutline
} from "$lib/utils/icons";
import type { Component } from "svelte";

export const BASE_API_URI = "http://localhost:5000";

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

export type RouteMap = {
  url: string;
  title: string;
  position: RouteLinkPosition[];
  icon: Component;
  restricted: RestrictionType;
  target: "_blank" | "_self" | "";
};

export const ROUTE_MAPPING: RouteMap[] = [
  {
    url: "/home",
    title: "Home",
    position: ["menu"],
    icon: HouseIcon,
    restricted: "house_member",
    target: ""
  },
  {
    url: "/home/todo",
    title: "Todos",
    position: ["header_left", "drawer_top", "menu"],
    icon: TodoIcon,
    restricted: "house_member",
    target: ""
  },
  {
    url: "/home/chores",
    title: "Chores",
    position: ["header_left", "drawer_top", "menu"],
    icon: ChoresIcon,
    restricted: "house_member",
    target: ""
  },
  {
    url: "/about",
    title: "About",
    position: ["header_right", "drawer_bottom"],
    icon: DocsIcon,
    restricted: "none",
    target: ""
  },
  {
    url: "https://tidymate-docs.vercel.app/",
    title: "Documentation",
    position: ["header_right", "drawer_bottom"],
    icon: InfoIcon,
    restricted: "none",
    target: "_blank"
  },
  {
    url: "/profile/user",
    title: "Your Profile",
    position: ["avatar_dropdown"],
    icon: UserCircleOutline,
    restricted: "logged_in",
    target: ""
  },
  {
    url: "/profile/house",
    title: "Your House",
    position: ["avatar_dropdown"],
    icon: HouseCircleOutline,
    restricted: "house_member",
    target: ""
  },
  {
    url: "/auth/login",
    title: "Login",
    position: ["avatar_dropdown"],
    icon: SignIn,
    restricted: "logged_out",
    target: ""
  },
  {
    url: "/auth/register/house",
    title: "Register House",
    position: ["avatar_dropdown"],
    icon: RegisterIcon,
    restricted: "no_house_member",
    target: ""
  },
  {
    url: "/auth/register",
    title: "Register",
    position: ["avatar_dropdown"],
    icon: RegisterIcon,
    restricted: "logged_out",
    target: ""
  },
  {
    url: "/auth/logout",
    title: "Logout",
    position: ["avatar_dropdown"],
    icon: SignOut,
    restricted: "logged_in",
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

export type RoomConfig = {
  name: string;
  icon: Component;
  color: string;
};
export const ROOM_CONFIG: RoomConfig[] = [
  { name: "General", icon: GeneralIcon, color: "bg-stone-500" },
  { name: "Bathroom", icon: BathroomIcon, color: "bg-blue-500" },
  { name: "Bedroom", icon: BedroomIcon, color: "bg-amber-400" },
  { name: "Kitchen", icon: KitchenIcon, color: "bg-violet-500" },
  { name: "Living Room", icon: LivingRoomIcon, color: "bg-lime-400" },
  { name: "Office", icon: OfficeIcon, color: "bg-rose-400" },
  { name: "Outdoor", icon: OutdoorIcon, color: "bg-indogo-700" },
  { name: "House", icon: HouseIcon, color: "bg-primary" }
];
