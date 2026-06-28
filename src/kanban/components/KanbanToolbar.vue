<script setup lang="ts">
import type { StatusFilter } from "@/kanban/types";

defineProps<{
  hasActiveFilters?: boolean;
}>();

defineEmits<{
  (e: "click-clear-filters"): void;
  (e: "click-add-task"): void;
}>();

const searchQuery = defineModel<string>("searchQuery");
const statusFilter = defineModel<StatusFilter>("statusFilter");
</script>

<template>
  <div class="shrink-0 border-b border-gray-300 bg-white p-4">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem] lg:min-w-0 lg:flex-1">
        <label
          class="sr-only"
          for="task-search"
        >
          Meklēt uzdevumus
        </label>
        <input
          id="task-search"
          v-model="searchQuery"
          type="search"
          placeholder="Meklēt"
          class="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 leading-none"
        />

        <label
          class="sr-only"
          for="status-filter"
        >
          Filtrēt pēc statusa
        </label>
        <select
          id="status-filter"
          v-model="statusFilter"
          class="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="all">Visi statusi</option>
          <option value="todo">Darāms (Todo)</option>
          <option value="in-progress">Procesā (In Progress)</option>
          <option value="done">Pabeigts (Done)</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="hasActiveFilters"
          type="button"
          class="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
          @click="$emit('click-clear-filters')"
        >
          Notīrīt filtrus
        </button>

        <button
          type="button"
          class="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 ms-auto border border-transparent"
          @click="$emit('click-add-task')"
        >
          Jauns uzdevums
        </button>
      </div>
    </div>
  </div>
</template>
