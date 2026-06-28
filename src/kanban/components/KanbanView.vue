<script setup lang="ts">
import { move } from "@dnd-kit/helpers";
import type { DragOverEvent, DragEndEvent } from "@dnd-kit/vue";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import KanbanToolbar from "@/kanban/components/KanbanToolbar.vue";
import { useKanbanStore } from "@/kanban/stores/kanbanStore";
import {
  TASK_STATUSES,
  type StatusFilter,
  type Task,
  type TaskColumn,
  type TaskStatus,
  type TaskDraft,
} from "@/kanban/types";
import { applyTaskRecord, cloneColumns, createTaskRecord } from "@/kanban/utils.ts";

import KanbanBoard from "./KanbanBoard.vue";
import KanbanDialogCreateEdit from "./KanbanDialogCreateEdit.vue";
import KanbanDialogDeleteConfirm from "./KanbanDialogDeleteConfirm.vue";

const kanbanStore = useKanbanStore();

const { hasActiveFilters, filters, columns, filteredColumns } = storeToRefs(kanbanStore);
const transientColumns = ref<TaskColumn[] | null>(null);

const isCreateEditDialogOpen = ref(false);
const createTaskStatus = ref<TaskStatus>("todo");
const editingTaskId = ref<string | null>(null);
const pendingDeleteTaskId = ref<string | null>(null);

const searchQuery = computed({
  get: () => filters.value.searchQuery,
  set: (value: string) => kanbanStore.setSearchQuery(value),
});

const statusFilter = computed({
  get: () => filters.value.status,
  set: (value: StatusFilter) => kanbanStore.setStatusFilter(value),
});

const editingTask = computed(() => {
  if (!editingTaskId.value) {
    return null;
  }

  return kanbanStore.getTaskById(editingTaskId.value) ?? null;
});

const pendingDeleteTask = computed(() => {
  if (!pendingDeleteTaskId.value) {
    return null;
  }

  return kanbanStore.getTaskById(pendingDeleteTaskId.value) ?? null;
});

const deleteMessage = computed(() => {
  if (!pendingDeleteTask.value) {
    return "";
  }

  return `Uzdevums "${pendingDeleteTask.value.title}" tiks neatgriezeniski dzēsts.`;
});

const visibleColumns = computed(() =>
  hasActiveFilters.value ? filteredColumns.value : (transientColumns.value ?? columns.value),
);

function onClickAddTask(status: TaskStatus) {
  editingTaskId.value = null;
  createTaskStatus.value = status;
  isCreateEditDialogOpen.value = true;
}

function onClickEditTask(taskId: Task["id"]) {
  editingTaskId.value = taskId;
  isCreateEditDialogOpen.value = true;
}

function onClickDeleteTask(taskId: Task["id"]) {
  pendingDeleteTaskId.value = taskId;
}

function closeCreateEditDialog() {
  isCreateEditDialogOpen.value = false;
  editingTaskId.value = null;
}

function saveCreateEditDialog(payload: TaskDraft) {
  if (editingTaskId.value) {
    kanbanStore.updateTask(editingTaskId.value, payload);
  } else {
    kanbanStore.createTask(payload);
  }

  closeCreateEditDialog();
}

function closeDeleteConfigDialog() {
  pendingDeleteTaskId.value = null;
}

function confirmDelete() {
  if (pendingDeleteTaskId.value) {
    kanbanStore.deleteTask(pendingDeleteTaskId.value);
  }

  closeDeleteConfigDialog();
}

function handleDragStart() {
  transientColumns.value = cloneColumns(columns.value);
}

function handleDragOver(event: DragOverEvent) {
  const activeColumns = transientColumns.value ?? cloneColumns(columns.value);
  const nextRecord = move(createTaskRecord(activeColumns), event);

  transientColumns.value = applyTaskRecord(activeColumns, nextRecord);
}

function handleDragEnd(event: DragEndEvent) {
  if (event.canceled) {
    transientColumns.value = null;
    return;
  }

  if (transientColumns.value) {
    kanbanStore.commitDraggedColumns(transientColumns.value);
  }

  transientColumns.value = null;
}
</script>

<template>
  <div class="min-h-svh h-dvh flex flex-col overflow-hidden bg-white text-slate-900">
    <KanbanToolbar
      v-model:search-query="searchQuery"
      v-model:status-filter="statusFilter"
      :has-active-filters="hasActiveFilters"
      @click-add-task="onClickAddTask(TASK_STATUSES[0])"
      @click-clear-filters="kanbanStore.clearFilters"
    />

    <KanbanBoard
      :columns="visibleColumns"
      :has-active-filters="hasActiveFilters"
      @click-add-task="onClickAddTask"
      @click-edit-task="onClickEditTask"
      @click-delete-task="onClickDeleteTask"
      @drag-start="handleDragStart"
      @drag-over="handleDragOver"
      @drag-end="handleDragEnd"
    />

    <KanbanDialogCreateEdit
      :open="isCreateEditDialogOpen"
      :task="editingTask"
      :default-status="createTaskStatus"
      @save="saveCreateEditDialog"
      @close="closeCreateEditDialog"
    />

    <KanbanDialogDeleteConfirm
      :open="pendingDeleteTaskId !== null"
      :message="deleteMessage"
      @cancel="closeDeleteConfigDialog"
      @confirm="confirmDelete"
    />
  </div>
</template>
