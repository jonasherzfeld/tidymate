<script lang="ts">
    import CalendarIcon from 'lucide-svelte/icons/calendar';
    import {
        type DateValue,
        DateFormatter,
        getLocalTimeZone,
        today
    } from '@internationalized/date';
    import { cn } from '$lib/utils.js';
    import { Button } from '$lib/components/ui/button';
    import { Calendar } from '$lib/components/ui/calendar';
    import * as Popover from '$lib/components/ui/popover';
    import ChevronLeft from 'virtual:icons/fluent/chevron-left-28-filled';

    const df = new DateFormatter('en-US', {
        dateStyle: 'long'
    });

    let value: DateValue = $state(today(getLocalTimeZone()));
</script>

<div class="flex mt-3 mb-6 relative items-center justify-center">
    <div class="absolute left-0 items-center">
        <a href="/home/todo" class="flex items-center gap-1"><ChevronLeft />Back</a>
    </div>
</div>
<div class="flex flex-col flex-1 gap-3 min-w-full">
    <div class=" flex flex-col flex-1 gap-2 p-3 card bg-base-300">
        <span>{value}</span>
        <Popover.Root openFocus>
            <Popover.Trigger asChild let:builder>
                <Button
                    variant="outline"
                    class={cn(
                        'w-[280px] justify-start text-left font-normal',
                        !value && 'text-muted-foreground'
                    )}
                    builders={[builder]}
                >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {value ? df.format(value.toDate(getLocalTimeZone())) : 'Select a date'}
                </Button>
            </Popover.Trigger>
            <Popover.Content class="w-auto p-0 bg-base-300">
                <Calendar bind:value initialFocus />
            </Popover.Content>
        </Popover.Root>
    </div>
</div>
