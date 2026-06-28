<script setup lang="ts">
import { DragDropProvider } from "@dnd-kit/vue";
import type { DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/vue";

import KanbanCard from "@/kanban/components/KanbanCard.vue";
import KanbanColumn from "@/kanban/components/KanbanColumn.vue";
import type { ColumnDefinition, TaskColumn, Task } from "@/kanban/types";

defineProps<{
  hasActiveFilters?: boolean;
  columns: TaskColumn[];
}>();

defineEmits<{
  (e: "click-add-task", columnId: ColumnDefinition["id"]): void;
  (e: "click-edit-task", taskId: Task["id"]): void;
  (e: "click-delete-task", taskId: Task["id"]): void;
  (e: "drag-start", event: DragStartEvent): void;
  (e: "drag-over", event: DragOverEvent): void;
  (e: "drag-end", event: DragEndEvent): void;
}>();
</script>

<template>
  <DragDropProvider
    @drag-start="$emit('drag-start', $event)"
    @drag-over="$emit('drag-over', $event)"
    @drag-end="$emit('drag-end', $event)"
  >
    <div
      class="flex min-h-0 flex-1 gap-4 overflow-x-auto overflow-y-hidden p-4 max-sm:overflow-y-hidden"
    >
      <KanbanColumn
        v-for="(column, columnIndex) in columns"
        :key="column.id"
        :index="columnIndex"
        :id="column.id"
        :title="column.title"
        :task-count="column.tasks.length"
        @click-add-task="$emit('click-add-task', column.id)"
      >
        <KanbanCard
          v-for="(task, taskIndex) in column.tasks"
          :key="task.id"
          :index="taskIndex"
          :column-id="column.id"
          :task="task"
          :drag-disabled="hasActiveFilters"
          :is-deleting="false"
          @click-edit-task="$emit('click-edit-task', task.id)"
          @click-delete-task="$emit('click-delete-task', task.id)"
        />
      </KanbanColumn>
    </div>
  </DragDropProvider>
</template>
