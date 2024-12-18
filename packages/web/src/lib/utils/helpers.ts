import { ROUTE_MAPPING, type RestrictionType } from "./constants";

export function byPropertiesOf<T extends object>(sortBy: Array<sortArg<T>>) {
  function compareByProperty(arg: sortArg<T>) {
    let key: keyof T;
    let sortOrder = 1;
    if (typeof arg === "string" && arg.startsWith("-")) {
      sortOrder = -1;
      key = arg.substring(1) as keyof T;
    } else {
      key = arg as keyof T;
    }
    return function (a: T, b: T) {
      let valA = a[key];
      let valB = b[key];
      if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase() as T[keyof T];
        valB = valB.toLowerCase() as T[keyof T];
      }
      const result = valA < valB ? -1 : valA > valB ? 1 : 0;

      return result * sortOrder;
    };
  }

  return function (obj1: T, obj2: T) {
    let i = 0;
    let result = 0;
    const numberOfProperties = sortBy?.length;
    while (result === 0 && i < numberOfProperties) {
      result = compareByProperty(sortBy[i])(obj1, obj2);
      i++;
    }

    return result;
  };
}

export function sortBy<T extends object>(
  arr: T[],
  ...sortBy: Array<sortArg<T>>
) {
  arr.sort(byPropertiesOf<T>(sortBy));
}

export function initializeFilterValues<T>(
  filters: FilterDescription<T>[],
  list: T[]
) {
  for (const todo of list) {
    for (const filter of filters) {
      const values = todo[filter.property] as string | string[];
      if (values) {
        if (Array.isArray(values)) {
          filter.values = [...filter.values, ...values];
        } else {
          filter.values = [...filter.values, values];
        }
      }
    }
  }
}

export function getRestrictionType(
  isLoggedIn: boolean,
  isHouseMember: boolean
): RestrictionType[] {
  return isLoggedIn && isHouseMember
    ? ["logged_in", "house_member"]
    : isLoggedIn
      ? ["logged_in", "no_house_member"]
      : ["logged_out"];
}

export function getRouteTitle(url: string | null): string | undefined {
  if (!url) {
    return undefined;
  }
  let item = ROUTE_MAPPING.find((item) => item.url === url);
  return item?.title;
}

export function getUsernameById(
  id: string,
  userList: User[]
): string | undefined {
  const member = userList.find((member) => member.id === id);
  if (member) {
    return `${member.first_name} ${member.last_name}`;
  }
  return undefined;
}
