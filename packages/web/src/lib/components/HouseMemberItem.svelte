<script lang="ts">
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import AvatarGraphic from './AvatarGraphic.svelte';

    let {
        user_id = '',
        is_admin = false,
        src = '',
        first_name = '',
        last_name = '',
        joined_on = '',
        change_enabled = false
    }: {
        user_id: string;
        is_admin: boolean;
        src: string;
        first_name: string;
        last_name: string;
        joined_on: string;
        change_enabled: boolean;
    } = $props();

    let is_calling_user = $state(user_id === $page.data.user.id);
    let change_enabled_var = $derived(change_enabled && !is_calling_user);
    let date = new Date(joined_on);
    let changing_admin_status = $state(false);

    const handleIsAdmin = async () => {
        changing_admin_status = true;

        return async ({ result, update }) => {
            if (result.status !== 200) {
                await update();
            }
            changing_admin_status = false;
        };
    };
</script>

<tr class={is_calling_user ? 'bg-base-100' : ''}>
    <td>
        <div class="flex items-center gap-3">
            <div class="avatar">
                <AvatarGraphic
                    height="h-10"
                    width="w-10"
                    {first_name}
                    {last_name}
                    thumbnail={src}
                />
            </div>
            <div>
                <div class="font-bold">{first_name} {last_name}</div>
            </div>
        </div>
    </td>
    <td>
        <div class="">{date.toLocaleDateString('en-GB')}</div>
    </td>
    <th>
        <form action="/profile/house?/set_admin" method="POST" use:enhance={handleIsAdmin}>
            <input type="hidden" name="user_id" value={user_id} />
            <input
                type="checkbox"
                name="is_admin"
                class="toggle toggle-primary cursor-pointer"
                onchange={(e) => e.target.form.requestSubmit()}
                bind:checked={is_admin}
                disabled={!change_enabled_var || changing_admin_status}
            />
        </form>
    </th>
</tr>
