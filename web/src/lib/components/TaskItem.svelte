<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { cn } from "$lib/utils";
  import { CalendarIcon, RedoIcon, MenuDots } from "$lib/utils/icons";
  import { Badge, Checkbox, IconButton, toast } from "$lib/components/ui";
  import AvatarGraphic from "./AvatarGraphic.svelte";
  import Dropdown from "./dropdown/Dropdown.svelte";
  import DropdownContent from "./dropdown/DropdownContent.svelte";
  import DropdownButton from "./dropdown/DropdownTrigger.svelte";
  import DropdownActionItem from "./dropdown/DropdownActionItem.svelte";
  import DropdownLinkItem from "./dropdown/DropdownLinkItem.svelte";
  import type { CategoryConfig } from "$lib/utils/constants";

  type Kind = "todo" | "chore" | "reminder";

  let {
    id,
    title,
    done = $bindable(false),
    kind,
    category,
    assigneeName,
    assigneeThumbnail = "",
    deadline,
    frequencyDescription,
    daysSinceLastDone,
    onCheck,
    onRemove
  }: {
    id: string;
    title: string;
    done: boolean;
    kind: Kind;
    category?: CategoryConfig;
    assigneeName?: string;
    assigneeThumbnail?: string;
    deadline?: string;
    frequencyDescription?: string;
    daysSinceLastDone?: number;
    /** Called when the check succeeds. For todos the new `done` is passed; for recurring items
     *  the server returns updated deadline/last_done — handled at the list level via invalidateAll. */
    onCheck?: (next: boolean, payload?: unknown) => void;
    onRemove?: () => void;
  } = $props();

  const routeRoot =
    kind === "todo" ? "/home/todo" : kind === "chore" ? "/home/chores" : "/home/reminders";
  const checkAction = `${routeRoot}?/check_${kind}&id=${id}`;
  const deleteAction = `${routeRoot}?/delete_${kind}&id=${id}`;
  const editHref = `${routeRoot}/${id}`;
  const isRecurring = kind !== "todo";

  // For todos `done` persists in UI; for recurring items the check is a fire-once
  // animation that resets after the request returns and the list invalidates.
  let displayedDone = $state(done);
  $effect(() => {
    displayedDone = done;
  });

  let deadlineDate = $derived(deadline ? new Date(deadline) : undefined);
  let dueDays: number | undefined = $derived.by(() => {
    if (!deadlineDate) return undefined;
    return Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 3600 * 24));
  });

  let dueVariant: "neutral" | "info" | "warning" | "error" = $derived.by(() => {
    if (dueDays === undefined) return "neutral";
    if (dueDays < 0) return "error";
    if (dueDays <= 1) return "warning";
    if (dueDays <= 3) return "info";
    return "neutral";
  });

  let dueLabel = $derived.by(() => {
    if (dueDays === undefined) return "";
    if (dueDays < 0) return `${-dueDays}d overdue`;
    if (dueDays === 0) return "Due today";
    if (dueDays === 1) return "Due tomorrow";
    if (dueDays < 7) return `In ${dueDays} days`;
    return deadlineDate?.toLocaleDateString(undefined, { month: "short", day: "numeric" }) ?? "";
  });

  let lastDoneLabel = $derived.by(() => {
    if (daysSinceLastDone === undefined) return "";
    if (daysSinceLastDone === 0) return "today";
    if (daysSinceLastDone === 1) return "yesterday";
    return `${daysSinceLastDone}d ago`;
  });

  const handleCheck = async () => {
    return async ({ result, update }) => {
      if (result.status !== 200) {
        if (!isRecurring) displayedDone = !displayedDone;
        toast.error("Couldn't update", "Please try again.");
        await update();
        return;
      }
      if (isRecurring) {
        displayedDone = false;
        onCheck?.(false, result.data);
        await invalidateAll();
      } else {
        done = displayedDone;
        onCheck?.(displayedDone);
      }
    };
  };

  const handleRemove = async () => {
    return async ({ result, update }) => {
      if (result.status === 200) {
        onRemove?.();
        toast.success("Deleted");
        await invalidateAll();
      } else {
        toast.error("Couldn't delete", "Please try again.");
        await update();
      }
    };
  };
</script>

<div
  class={cn(
    "group bg-base-100 border-neutral rounded-field relative flex items-start gap-3 border px-3 py-3 sm:px-4",
    "transition-all duration-200 ease-[var(--ease-smooth)]",
    "hover:border-base-content/15 hover:shadow-[var(--shadow-sm)]",
    displayedDone && "opacity-65"
  )}>
  <form class="mt-0.5 flex shrink-0" action={checkAction} method="POST" use:enhance={handleCheck}>
    <Checkbox
      name={`check_${kind}`}
      bind:checked={displayedDone}
      onchange={(e) => {
        const t = e.currentTarget as HTMLInputElement;
        if (!isRecurring) {
          // Optimistic: keep state, submit; rollback in handleCheck on error
          displayedDone = t.checked;
        }
        t.form?.requestSubmit();
      }} />
  </form>

  <div class="min-w-0 flex-1">
    <div class="flex items-center gap-2">
      {#if category}
        <Badge size="xs" class={cn("!ring-1 ring-inset", category.tint)}>
          <category.icon class="h-3 w-3" />
          {category.name}
        </Badge>
      {/if}
      <h3
        class={cn(
          "text-base-content min-w-0 truncate text-sm leading-snug font-medium transition-all",
          displayedDone && "line-through decoration-2"
        )}>
        {title}
      </h3>
    </div>

    <div class="text-muted mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      {#if deadline && dueLabel}
        <span
          class={cn(
            "inline-flex items-center gap-1",
            dueVariant === "warning" && "text-warning",
            dueVariant === "error" && "text-error",
            dueVariant === "info" && "text-info"
          )}>
          <CalendarIcon class="h-3 w-3" />
          {dueLabel}
        </span>
      {/if}

      {#if isRecurring && frequencyDescription}
        <span class="inline-flex items-center gap-1">
          <RedoIcon class="h-3 w-3" />
          {frequencyDescription}{lastDoneLabel ? ` · last ${lastDoneLabel}` : ""}
        </span>
      {/if}

      {#if assigneeName}
        <span class="inline-flex items-center gap-1">
          <AvatarGraphic
            thumbnail={assigneeThumbnail}
            height="h-4"
            width="w-4"
            textSize="text-[0.4rem]"
            firstName={assigneeName.split(" ")[0]}
            lastName={assigneeName.split(" ")[1]} />
          {assigneeName}
        </span>
      {/if}
    </div>
  </div>

  <div
    class="shrink-0 self-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 sm:opacity-100">
    <Dropdown>
      <DropdownButton className="btn-ghost btn-xs btn-square">
        <MenuDots />
      </DropdownButton>
      <DropdownContent>
        <DropdownLinkItem href={editHref}>Edit</DropdownLinkItem>
        <form method="POST" use:enhance={handleRemove}>
          <DropdownActionItem action={deleteAction}>Delete</DropdownActionItem>
        </form>
      </DropdownContent>
    </Dropdown>
  </div>
</div>
