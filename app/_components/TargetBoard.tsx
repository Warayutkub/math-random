import { TARGET_MAX, TARGET_MIN } from "@/lib/game/round";
import { reelValues } from "@/lib/game/reel";
import { Reel } from "./Reel";

/** The target lands last, after every tile. */
export const TARGET_DEAL_MS = 1200;

function Bulbs() {
  return (
    <span aria-hidden className="flex w-full justify-between">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="size-2 rounded-full bg-bulb" />
      ))}
    </span>
  );
}

type Props = { target: number; compact?: boolean; dealSeed?: number };

/** Marquee sign with light bulbs, showing the target number. */
export function TargetBoard({ target, compact = false, dealSeed }: Props) {
  const dealing = dealSeed !== undefined;
  return (
    <section
      aria-label="เป้าหมาย"
      className={`flex flex-col items-center gap-xs rounded-xl bg-primary text-on-primary shadow-[0_8px_0_var(--color-primary-edge)] ${compact ? "p-lg" : "p-5"}`}
    >
      <Bulbs />
      <p className="font-semibold">{dealing ? "กำลังสุ่มเป้าหมาย…" : "เป้าหมาย"}</p>
      {dealing ? (
        <Reel
          key={dealSeed}
          values={reelValues(target, dealSeed, TARGET_MIN, TARGET_MAX)}
          durationMs={TARGET_DEAL_MS}
          className="h-22 w-40 text-center text-display"
        />
      ) : (
        <p className={compact ? "text-[56px] leading-none font-bold" : "flex h-22 items-center text-display"}>{target}</p>
      )}
      <Bulbs />
    </section>
  );
}
