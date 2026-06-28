<script setup lang="ts">
import { useSortable } from "@dnd-kit/vue/sortable";
import { computed, useTemplateRef } from "vue";

import type { ColumnDefinition, Task } from "@/kanban/types";

const props = defineProps<{
  index: number;
  columnId: ColumnDefinition["id"];
  task: Task;
  dragDisabled?: boolean;
  isDeleting?: boolean;
}>();

defineEmits<{
  (e: "click-edit-task"): void;
  (e: "click-delete-task"): void;
}>();

const { isDragging } = useSortable({
  id: computed(() => props.task.id),
  index: computed(() => props.index),
  group: computed(() => props.columnId),
  type: "task",
  accept: ["task"],
  disabled: computed(() => props.isDeleting || props.dragDisabled),
  element: useTemplateRef("elementRef"),
  handle: useTemplateRef("handleRef"),
});

const wasUpdated = computed(() => {
  return props.task.updatedAt !== props.task.createdAt;
});

const dateLabel = computed(() => {
  return wasUpdated.value ? "Atjaunots" : "Izveidots";
});

const formatter = new Intl.DateTimeFormat("lv-LV", {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateValue = computed(() => {
  const isoDate = wasUpdated.value ? props.task.updatedAt : props.task.createdAt;

  return formatter.format(new Date(isoDate));
});
</script>

<template>
  <div
    ref="elementRef"
    class="kanban-card flex min-w-0 gap-2 rounded-md border border-[#e4e6e9] bg-white p-2 mb-2 select-none"
    :class="[
      isDragging ? 'rotate-1 opacity-60 shadow-lg' : '',
      isDeleting ? 'pointer-events-none scale-95 opacity-0' : '',
    ]"
  >
    <button
      ref="handleRef"
      type="button"
      class="drag-handle flex shrink-0 touch-none select-none items-center justify-center rounded px-1 text-[#8a9099]"
      :class="dragDisabled ? 'cursor-not-allowed invisible' : 'cursor-grab active:cursor-grabbing'"
      aria-label="Pārvietot uzdevumu"
      :disabled="dragDisabled"
      @click.stop
    >
      ⋮⋮
    </button>

    <button
      type="button"
      class="flex min-w-0 flex-1 flex-col gap-1 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      :aria-label="`Rediģēt uzdevumu: ${task.title}`"
      @click="$emit('click-edit-task')"
    >
      <div class="truncate text-sm font-medium leading-5 text-slate-900">
        {{ task.title }}
      </div>

      <div
        v-if="task.description"
        class="truncate text-sm leading-5 text-[#5f6675]"
      >
        {{ task.description }}
      </div>

      <div class="text-xs leading-5 text-[#8a9099]">{{ dateLabel }}: {{ dateValue }}</div>
    </button>

    <button
      type="button"
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded text-[#8a9099] transition hover:bg-red-50 hover:text-red-600"
      aria-label="Dzēst uzdevumu"
      title="Dzēst uzdevumu"
      @click.stop="$emit('click-delete-task')"
    >
      <svg
        class="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        fill="currentColor"
      >
        <path
          d="M136.7 5.9C140.5 2.3 145.6 0 150.9 0H297.1C302.4 0 307.5 2.3 311.3 5.9L352 44.8H432C440.8 44.8 448 52 448 60.8C448 69.6 440.8 76.8 432 76.8H16C7.2 76.8 0 69.6 0 60.8C0 52 7.2 44.8 16 44.8H96L136.7 5.9zM53.2 108.8H394.8L376.6 435.8C374.8 468.4 347.9 494.1 315.3 494.1H132.7C100.1 494.1 73.2 468.4 71.4 435.8L53.2 108.8z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.kanban-card[data-dnd-placeholder] {
  background: transparent;
  border-color: #d1d5db;
  border-style: dashed;
  box-shadow: none;
}

.kanban-card[data-dnd-placeholder] > * {
  opacity: 0;
  pointer-events: none;
}
</style>
