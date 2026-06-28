import { nextTick, onBeforeUnmount, watch, type Ref } from "vue";

type DialogA11yOptions = {
  open: Ref<boolean>;
  dialogRef: Ref<HTMLElement | null>;
  initialFocusRef?: Ref<HTMLElement | null>;
  onClose: () => void;
  onConfirm?: () => void;
  confirmOnEnter?: boolean;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function useDialogA11y(options: DialogA11yOptions) {
  let previousFocusedElement: HTMLElement | null = null;

  watch(
    () => options.open.value,
    async (isOpen) => {
      if (isOpen) {
        previousFocusedElement =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;

        document.addEventListener("keydown", handleDocumentKeydown);
        await nextTick();
        focusInitialElement();
        return;
      }

      document.removeEventListener("keydown", handleDocumentKeydown);
      restorePreviousFocus();
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleDocumentKeydown);
    restorePreviousFocus();
  });

  function handleDocumentKeydown(event: KeyboardEvent) {
    if (!options.open.value) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      options.onClose();
      return;
    }

    if (event.key === "Enter" && options.confirmOnEnter && !isInteractiveElement(event.target)) {
      event.preventDefault();
      options.onConfirm?.();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    trapFocus(event);
  }

  function focusInitialElement() {
    const initialElement = options.initialFocusRef?.value ?? options.dialogRef.value;

    initialElement?.focus();
  }

  function trapFocus(event: KeyboardEvent) {
    const dialog = options.dialogRef.value;

    if (!dialog) {
      return;
    }

    const focusableElements = getFocusableElements(dialog);

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (event.shiftKey && (activeElement === firstElement || activeElement === dialog)) {
      event.preventDefault();
      lastElement?.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }

  function restorePreviousFocus() {
    previousFocusedElement?.focus();
    previousFocusedElement = null;
  }
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute("disabled") && element.getClientRects().length > 0,
  );
}

function isInteractiveElement(target: EventTarget | null) {
  return target instanceof HTMLElement && target.closest(FOCUSABLE_SELECTOR) !== null;
}
