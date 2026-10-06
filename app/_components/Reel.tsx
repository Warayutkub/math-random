import type { CSSProperties } from "react";

type Props = { values: number[]; durationMs: number; className?: string };

/** Slot-machine reel: the strip slides up and lands on the last value. Each cell fills the window height. */
export function Reel({ values, durationMs, className = "" }: Props) {
  const style = {
    "--reel-duration": `${durationMs}ms`,
    "--reel-end": `${-(values.length - 1) * 100}%`,
  } as CSSProperties;

  return (
    <span className={`reel-land block overflow-hidden ${className}`} style={style}>
      <span aria-hidden className="reel-strip flex h-full flex-col">
        {values.map((v, i) => (
          <span key={i} className="flex h-full shrink-0 items-center justify-center">
            {v}
          </span>
        ))}
      </span>
      <span className="sr-only">{values.at(-1)}</span>
    </span>
  );
}
