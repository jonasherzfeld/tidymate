<script lang="ts">
    import HouseMemberItem from './HouseMemberItem.svelte';

    let {
        userList = $bindable([]),
        changeEnabled = false
    }: {
        userList: User[];
        changeEnabled: boolean;
    } = $props();
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
            {#each userList as user}
                <HouseMemberItem
                    userId={user.id}
                    firstName={user.first_name}
                    lastName={user.last_name}
                    isAdmin={user.is_admin}
                    joinedOn={user.joined_on}
                    src={user.thumbnail ? user.thumbnail : ''}
                    {changeEnabled}
                />
            {/each}
        </tbody>
    </table>
</div>
