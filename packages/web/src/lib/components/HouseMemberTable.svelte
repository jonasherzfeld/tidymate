<script lang="ts">
    import Unknown_Avatar from '$lib/img/Unknown_person.jpg';
    import HouseMemberItem from './HouseMemberItem.svelte';

    type Props = {
        user_list: User[];
        change_enabled: Boolean;
    };
    let { user_list = $bindable([]), change_enabled = false }: Props = $props();
</script>

<div class="overflow-x-auto">
    <h2 class="m-4 text-xl font-bold">House Members</h2>
    <table class="table">
        <thead>
            <tr>
                <th>User</th>
                <th>Joined On</th>
                <th>Admin</th>
            </tr>
        </thead>
        <tbody>
            {#each user_list as user}
                <HouseMemberItem
                    user_id={user.id}
                    first_name={user.first_name}
                    last_name={user.last_name}
                    is_admin={user.is_admin}
                    joined_on={user.joined_on}
                    src={user.thumbnail ? user.thumbnail : ''}
                    {change_enabled}
                />
            {/each}
        </tbody>
    </table>
</div>
