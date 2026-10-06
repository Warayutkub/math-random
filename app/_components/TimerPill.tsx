type State = "normal" | "low" | "ended";

const STATE_CLASS: Record<State, string> = {
  normal: "bg-surface-2 text-text",
  low: "bg-plus text-on-primary",
  ended: "bg-surface text-muted",
};

export function TimerPill({ state, label, ariaLabel }: { state: State; label: string; ariaLabel: string }) {
  return (
    <p aria-label={ariaLabel} className={`rounded-full px-lg py-1.5 text-xl font-bold tabular-nums ${STATE_CLASS[state]}`}>
      {label}
    </p>
  );
}
