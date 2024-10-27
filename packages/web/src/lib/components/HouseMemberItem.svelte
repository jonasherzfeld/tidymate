<script>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';

    let {
        form,
        user_id = '',
        is_admin = false,
        src = '',
        first_name = '',
        last_name = '',
        joined_on = '',
        change_enabled = false
    } = $props();

    let is_calling_user = $state(user_id === $page.data.user.id);
    let change_enabled_var = $derived(change_enabled && !is_calling_user);
    let date = new Date(joined_on);
    let changing_admin_status = $state(false);

    const handleIsAdmin = async () => {
        changing_admin_status = true;

        return async ({ update }) => {
            await update();
            changing_admin_status = false;
        };
    };
</script>

<tr class={is_calling_user ? 'bg-base-300' : ''}>
    <td>
        <div class="flex items-center gap-3">
            <div class="avatar">
                <div class="mask mask-squircle h-12 w-12">
                    <img {src} alt="{first_name} {last_name}" />
                </div>
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
        <form
            bind:this={form}
            action="/profile/house?/set_admin"
            method="POST"
            use:enhance={handleIsAdmin}
        >
            <input type="hidden" name="user_id" value={user_id} />
            <input
                type="checkbox"
                name="is_admin"
                class="toggle toggle-primary cursor-pointer"
                onchange={() => form.requestSubmit()}
                bind:checked={is_admin}
                disabled={!change_enabled_var || changing_admin_status}
            />
        </form>
    </th>
</tr>
