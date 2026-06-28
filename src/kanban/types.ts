export const TASK_STATUSES = ["todo", "in-progress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type StatusFilter = "all" | TaskStatus;

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type TaskDraft = {
  title: string;
  description?: string;
  status: TaskStatus;
};

export type TaskFilters = {
  searchQuery: string;
  status: StatusFilter;
};

export type ColumnDefinition = {
  id: TaskStatus;
  title: string;
};

export type TaskColumn = ColumnDefinition & {
  tasks: Task[];
};
