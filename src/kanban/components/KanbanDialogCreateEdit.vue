<script setup lang="ts">
import { computed, reactive, toRef, useId, useTemplateRef, watch } from "vue";

import { useDialogA11y } from "@/kanban/composables/useDialogA11y";
import type { Task, TaskDraft, TaskStatus } from "@/kanban/types";

const props = defineProps<{
  open: boolean;
  task: Task | null;
  defaultStatus: TaskStatus;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", payload: TaskDraft): void;
}>();

const form = reactive<TaskDraft>({
  title: "",
  description: "",
  status: "todo",
});

const isEditMode = computed(() => props.task !== null);
const dialogTitle = computed(() => (isEditMode.value ? "Rediģēt" : "Jauns uzdevums"));
const submitLabel = computed(() => (isEditMode.value ? "Saglabāt" : "Izveidot"));
const canSave = computed(() => form.title.trim().length > 0);
const dialogTitleId = useId();
const titleInputId = useId();
const descriptionInputId = useId();
const statusInputId = useId();
const dialogRef = useTemplateRef<HTMLElement>("dialogRef");
const titleInputRef = useTemplateRef<HTMLInputElement>("titleInputRef");

watch(
  () => [props.open, props.task, props.defaultStatus] as const,
  ([isOpen, task, defaultStatus]) => {
    if (!isOpen) {
      return;
    }

    if (task) {
      form.title = task.title;
      form.description = task.description ?? "";
      form.status = task.status;
      return;
    }

    form.title = "";
    form.description = "";
    form.status = defaultStatus;
  },
  { immediate: true },
);

useDialogA11y({
  open: toRef(props, "open"),
  dialogRef,
  initialFocusRef: titleInputRef,
  onClose: () => emit("close"),
});

function closeDialog() {
  emit("close");
}

function submitForm() {
  if (!canSave.value) {
    return;
  }

  emit("save", {
    title: form.title.trim(),
    description: form.description?.trim(),
    status: form.status,
  });
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade-scale">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="closeDialog"
      >
        <form
          ref="dialogRef"
          :aria-labelledby="dialogTitleId"
          aria-modal="true"
          class="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl focus:outline-none"
          role="dialog"
          tabindex="-1"
          @submit.prevent="submitForm"
        >
          <div class="mb-4 flex items-center justify-between gap-3">
            <h2
              :id="dialogTitleId"
              class="text-lg font-semibold text-gray-900"
            >
              {{ dialogTitle }}
            </h2>

            <button
              type="button"
              class="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Aizvērt"
              @click="closeDialog"
            >
              ✕
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label
                :for="titleInputId"
                class="mb-1 block text-sm font-medium text-gray-700"
              >
                Nosaukums
              </label>

              <input
                :id="titleInputId"
                ref="titleInputRef"
                v-model="form.title"
                type="text"
                maxlength="140"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Uzdevuma nosaukums"
              />
            </div>

            <div>
              <label
                :for="descriptionInputId"
                class="mb-1 block text-sm font-medium text-gray-700"
              >
                Apraksts
              </label>

              <textarea
                :id="descriptionInputId"
                v-model="form.description"
                rows="4"
                maxlength="600"
                class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                placeholder="Apraksts (neobligāts)"
              />
            </div>

            <div>
              <label
                :for="statusInputId"
                class="mb-1 block text-sm font-medium text-gray-700"
              >
                Statuss
              </label>

              <select
                :id="statusInputId"
                v-model="form.status"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="todo">Darāms (Todo)</option>
                <option value="in-progress">Procesā (In Progress)</option>
                <option value="done">Pabeigts (Done)</option>
              </select>
            </div>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="closeDialog"
            >
              Atcelt
            </button>

            <button
              type="submit"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!canSave"
            >
              {{ submitLabel }}
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>
