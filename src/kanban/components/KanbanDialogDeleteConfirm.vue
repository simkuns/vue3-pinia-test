<script setup lang="ts">
import { toRef, useId, useTemplateRef } from "vue";

import { useDialogA11y } from "@/kanban/composables/useDialogA11y";

const props = defineProps<{
  open: boolean;
  message: string;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "confirm"): void;
}>();

const dialogTitleId = useId();
const dialogDescriptionId = useId();
const dialogRef = useTemplateRef<HTMLElement>("dialogRef");

useDialogA11y({
  open: toRef(props, "open"),
  dialogRef,
  onClose: () => emit("cancel"),
  onConfirm: () => emit("confirm"),
  confirmOnEnter: true,
});
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade-scale">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="emit('cancel')"
      >
        <section
          ref="dialogRef"
          :aria-describedby="dialogDescriptionId"
          :aria-labelledby="dialogTitleId"
          aria-modal="true"
          class="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl focus:outline-none"
          role="alertdialog"
          tabindex="-1"
        >
          <div class="space-y-2">
            <h2
              :id="dialogTitleId"
              class="text-lg font-semibold text-gray-900"
            >
              Dzēst uzdevumu
            </h2>

            <p
              :id="dialogDescriptionId"
              class="text-sm text-gray-600"
            >
              {{ message }}
            </p>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="emit('cancel')"
            >
              Atcelt
            </button>

            <button
              type="button"
              class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              @click="emit('confirm')"
            >
              Dzēst
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
