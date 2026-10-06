export const REEL_LENGTH = 8;

/**
 * Values shown while a number "spins" before landing on `final` (the last item).
 * Deterministic so the server render and the browser agree (no hydration mismatch),
 * and never repeats a value next to itself so every step of the spin is visible.
 */
export function reelValues(final: number, seed: number, min: number, max: number, length = REEL_LENGTH): number[] {
  const span = max - min + 1;
  const values: number[] = [];
  let x = (final * 31 + seed * 17 + 7) % 2147483647;
  for (let i = 0; i < length - 1; i++) {
    x = (x * 48271) % 2147483647;
    let v = min + (x % span);
    while (v === values.at(-1) || (i === length - 2 && v === final)) v = min + ((v - min + 1) % span);
    values.push(v);
  }
  return [...values, final];
}
