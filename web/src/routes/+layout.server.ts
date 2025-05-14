import { SIDEBAR_COOKIE_NAME } from '$lib/components/sidebar/constants.js';

export async function load({ locals, cookies }) {
  const sidebarState = cookies.get(SIDEBAR_COOKIE_NAME);
  return {
    user: locals.user,
    house: locals.house,
    sidebarState: sidebarState
  };
}
