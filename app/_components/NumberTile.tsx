import { NUMBER_MAX, NUMBER_MIN } from "@/lib/game/round";
import { reelValues } from "@/lib/game/reel";
import { Reel } from "./Reel";

type State = "default" | "selected" | "used";

const STATE_CLASS: Record<State, string> = {
  default: "bg-tile-surface text-on-primary shadow-[0_6px_0_var(--color-tile-edge)] hover:-translate-y-0.5",
  selected: "bg-primary text-on-primary shadow-[0_6px_0_var(--color-primary-edge)]",
  used: "bg-surface-2 text-tile-used",
};

/** The deal is staggered: tile 1 lands at 600ms, each next one 120ms later. */
export const tileDealMs = (index: number) => 600 + index * 120;

type Props = {
  value: number;
  state: State;
  onClick: () => void;
  /** While dealing, the tile spins and lands on `value`. */
  deal?: { index: number; seed: number };
};

export function NumberTile({ value, state, onClick, deal }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "used" || !!deal}
      aria-pressed={state === "selected"}
      aria-label={state === "used" ? `${value} (ใช้แล้ว)` : String(value)}
      className={`flex h-17 min-w-0 flex-1 items-center justify-center rounded-lg text-tile transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-text disabled:cursor-default disabled:hover:translate-y-0 sm:max-w-20 ${STATE_CLASS[state]}`}
    >
      {deal ? (
        <Reel
          key={deal.seed}
          values={reelValues(value, deal.seed * 5 + deal.index, NUMBER_MIN, NUMBER_MAX)}
          durationMs={tileDealMs(deal.index)}
          className="h-full w-full"
        />
      ) : (
        value
      )}
    </button>
  );
}
