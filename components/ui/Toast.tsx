"use client";

import { useEffect } from "react";

type Props = { message: string; onDismiss: () => void; durationMs?: number };

/** Error toast: bottom-center on phones, bottom-right on desktop; hides itself after a moment. */
export function Toast({ message, onDismiss, durationMs = 2500 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [onDismiss, durationMs]);

  return (
    <div
      role="alert"
      className="fixed inset-x-5 bottom-2xl z-20 flex items-center gap-md rounded-lg bg-error px-lg py-md text-on-primary shadow-dialog lg:right-3xl lg:left-auto lg:w-sm"
    >
      <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full bg-on-primary font-bold text-text">
        !
      </span>
      <p className="font-semibold">{message}</p>
    </div>
  );
}
