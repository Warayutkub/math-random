type State = "default" | "selected" | "used";

const STATE_CLASS: Record<State, string> = {
  default: "border-[1.5px] border-border bg-surface text-text shadow-[0_2px_4px_#1e1b3a0f] hover:border-primary",
  selected: "bg-primary text-on-primary",
  used: "border-[1.5px] border-border bg-background text-[#c9c6d6]",
};

type Props = { value: number; state: State; onClick: () => void };

export function NumberTile({ value, state, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "used"}
      aria-pressed={state === "selected"}
      aria-label={state === "used" ? `${value} (ใช้แล้ว)` : String(value)}
      className={`flex aspect-square min-w-0 flex-1 items-center justify-center rounded-lg font-display text-tile transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:max-w-20 ${STATE_CLASS[state]}`}
    >
      {value}
    </button>
  );
}
