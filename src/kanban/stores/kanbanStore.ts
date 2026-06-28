import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import { load, save } from "@/kanban/storage/kanbanStorage";
import type {
  TaskColumn,
  TaskFilters,
  Task,
  TaskDraft,
  TaskStatus,
  StatusFilter,
} from "@/kanban/types";

export const useKanbanStore = defineStore("kanbanStore", () => {
  const columns = ref<TaskColumn[]>(load());
  const filters = ref<TaskFilters>({
    searchQuery: "",
    status: "all",
  });

  const allTasks = computed(() => columns.value.flatMap((column) => column.tasks));

  const hasActiveFilters = computed(() => {
    return filters.value.searchQuery.trim().length > 0 || filters.value.status !== "all";
  });

  const filteredColumns = computed<TaskColumn[]>(() =>
    columns.value.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => matchesFilters(task, filters.value)),
    })),
  );

  watch(columns, save, { deep: true });

  function createTask(draft: TaskDraft) {
    const now = new Date().toISOString();
    const nextTask: Task = {
      id: createTaskId(),
      title: draft.title.trim(),
      description: draft.description?.trim(),
      status: draft.status,
      createdAt: now,
      updatedAt: now,
    };

    const column = getColumnByStatus(columns.value, draft.status);

    if (column) {
      column.tasks.unshift(nextTask);
    }

    return nextTask;
  }

  function updateTask(taskId: string, draft: TaskDraft) {
    const location = findTaskLocation(taskId);

    if (!location) {
      return;
    }

    const updatedTask: Task = {
      ...location.task,
      title: draft.title.trim(),
      description: draft.description?.trim(),
      status: draft.status,
      updatedAt: new Date().toISOString(),
    };

    if (location.column.id === draft.status) {
      location.column.tasks.splice(location.taskIndex, 1, updatedTask);
      return;
    }

    location.column.tasks.splice(location.taskIndex, 1);

    const targetColumn = getColumnByStatus(columns.value, draft.status);

    if (targetColumn) {
      targetColumn.tasks.unshift(updatedTask);
    }
  }

  function deleteTask(taskId: string) {
    const location = findTaskLocation(taskId);

    if (!location) {
      return;
    }

    location.column.tasks.splice(location.taskIndex, 1);
  }

  function findTaskLocation(taskId: string) {
    for (const column of columns.value) {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId);

      if (taskIndex >= 0) {
        const task = column.tasks[taskIndex];

        if (!task) {
          continue;
        }

        return {
          column,
          task,
          taskIndex,
        };
      }
    }

    return null;
  }

  function getTaskById(taskId: string) {
    return allTasks.value.find((task) => task.id === taskId);
  }

  function setSearchQuery(searchQuery: string) {
    filters.value.searchQuery = searchQuery;
  }

  function setStatusFilter(status: StatusFilter) {
    filters.value.status = status;
  }

  function clearFilters() {
    filters.value = {
      searchQuery: "",
      status: "all",
    };
  }

  function commitDraggedColumns(nextColumns: TaskColumn[]) {
    const updatedAt = new Date().toISOString();

    columns.value = nextColumns.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) =>
        task.status === column.id
          ? task
          : {
              ...task,
              status: column.id,
              updatedAt,
            },
      ),
    }));
  }

  return {
    columns,
    filters,
    allTasks,
    hasActiveFilters,
    filteredColumns,
    createTask,
    updateTask,
    deleteTask,
    findTaskLocation,
    getTaskById,
    setSearchQuery,
    setStatusFilter,
    clearFilters,
    commitDraggedColumns,
  };
});

function matchesFilters(task: Task, filters: TaskFilters) {
  const query = filters.searchQuery.trim().toLocaleLowerCase();
  const matchesQuery =
    query.length === 0 ||
    task.title.toLocaleLowerCase().includes(query) ||
    task.description?.toLocaleLowerCase().includes(query);

  const matchesStatus = filters.status === "all" || task.status === filters.status;

  return matchesQuery && matchesStatus;
}

function createTaskId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getColumnByStatus(columns: TaskColumn[], status: TaskStatus) {
  return columns.find((column) => column.id === status);
}
