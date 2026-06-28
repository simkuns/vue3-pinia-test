<script setup lang="ts">
import { CollisionPriority } from "@dnd-kit/abstract";
import { useSortable } from "@dnd-kit/vue/sortable";
import { computed, useTemplateRef } from "vue";

import type { ColumnDefinition } from "@/kanban/types";

const props = defineProps<{
  index: number;
  id: ColumnDefinition["id"];
  title: ColumnDefinition["title"];
  taskCount: number;
}>();

defineEmits<{
  (e: "click-add-task"): void;
}>();

const { isDropTarget } = useSortable({
  id: computed(() => props.id),
  index: computed(() => props.index),
  type: "column",
  accept: "task",
  disabled: {
    draggable: true,
    droppable: false,
  },
  collisionPriority: CollisionPriority.Low,
  element: useTemplateRef("sortableRef"),
});
</script>

<template>
  <section class="flex min-h-0 min-w-0 flex-1 flex-col rounded-2xl bg-gray-50 max-sm:min-w-[75dvw]">
    <header class="flex shrink-0 items-center justify-between gap-3 px-2 py-4">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-slate-900">
          {{ title }}
        </span>

        <span class="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
          {{ taskCount }}
        </span>
      </div>

      <button
        type="button"
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 active:scale-95"
        aria-label="Pievienot uzdevumu"
        title="Pievienot uzdevumu"
        @click="$emit('click-add-task')"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          fill="currentColor"
        >
          <path
            d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"
          />
        </svg>
      </button>
    </header>

    <div
      ref="sortableRef"
      class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-xl p-2"
      :class="isDropTarget ? 'bg-blue-50' : ''"
    >
      <slot />
    </div>
  </section>
</template>
