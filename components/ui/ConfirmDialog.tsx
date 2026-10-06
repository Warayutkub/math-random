"use client";

import { useEffect, useRef } from "react";
import { Button } from "./Button";

type Props = {
  open: boolean;
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Confirm dialog on the native <dialog> element: it traps focus, closes on Esc,
 * and starts focus on the safe choice (cancel). Clicking the backdrop also cancels.
 */
export function ConfirmDialog({ open, title, body, cancelLabel, confirmLabel, onCancel, onConfirm }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      className="m-auto w-[calc(100%-2*var(--spacing-xl))] max-w-100 rounded-xl bg-surface p-xl text-text shadow-dialog backdrop:bg-scrim"
    >
      <h2 id="confirm-title" className="text-heading-h1">
        {title}
      </h2>
      <p className="mt-sm text-muted">{body}</p>
      <div className="mt-xl flex gap-sm">
        <Button variant="secondary" className="flex-1" autoFocus onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant="danger" className="flex-1" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
