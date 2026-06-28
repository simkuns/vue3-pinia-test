import type { Task, TaskColumn, TaskStatus } from "@/kanban/types";

export function cloneColumns(columns: TaskColumn[]): TaskColumn[] {
  return columns.map((column) => ({
    ...column,
    tasks: column.tasks.map((task) => ({
      ...task,
    })),
  }));
}

export function createTaskRecord(columns: TaskColumn[]): Record<TaskStatus, Task[]> {
  return columns.reduce<Record<TaskStatus, Task[]>>(
    (record, column) => {
      record[column.id] = column.tasks;
      return record;
    },
    {
      todo: [],
      "in-progress": [],
      done: [],
    },
  );
}

export function applyTaskRecord(
  columns: TaskColumn[],
  taskRecord: Record<TaskStatus, Task[]>,
): TaskColumn[] {
  return columns.map((column) => ({
    ...column,
    tasks: taskRecord[column.id] ?? [],
  }));
}
