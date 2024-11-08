<script lang="ts">
    import type { PageData } from './$types.js';
    import { superForm, formFieldProxy } from 'sveltekit-superforms/client';
    import TestLabel2 from '$lib/components/TestLabel2.svelte';

    let {data} = $props();
    let edit_first_name = $state(false);
    let creating_first_name = $state(false);
    let edit_last_name = $state(false);
    let creating_last_name = $state(false);

    const {
        form: first_name_form,
        enhance: first_name_enhance
    } = superForm(data.first_name_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            console.log('submitting');
            creating_first_name = true;
        },
        onUpdate: async ({ form }) => {
            console.log('updating');
            if (form.valid) {
                edit_first_name = false;
            } else {
                edit_first_name = true;
            }
            creating_first_name = false;
        }
    });

    const {
        form: last_name_form,
        errors: last_name_errors,
        enhance: last_name_enhance,
        message: last_name_message
    } = superForm(data.last_name_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creating_last_name = true;
        },
        onUpdate: async ({ form }) => {
            if (form.valid) {
                edit_last_name = false;
            } else {
                edit_last_name = true;
            }
            creating_last_name = false;
        }
    });


</script>

<form action="?/update_first_name" method="POST" use:first_name_enhance>
    <TestLabel2
        superform={data.first_name_form}
        field="first_name"
        bind:edit_value={edit_first_name}
        bind:creating_value={creating_first_name}
    />
</form>
<form action="?/update_last_name" method="POST" use:last_name_enhance>
    <TestLabel2
        superform={data.last_name_form}
        field="last_name"
        bind:edit_value={edit_last_name}
        bind:creating_value={creating_last_name}
    />
</form>