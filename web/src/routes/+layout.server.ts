export async function load({ locals }) {
  return {
    user: locals.user,
    house: locals.house,
    notifications: locals.notifications
  };
}
