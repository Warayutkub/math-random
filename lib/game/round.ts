export const NUMBER_COUNT = 5;
export const NUMBER_MIN = 1;
export const NUMBER_MAX = 10;
export const TARGET_MIN = 20;
export const TARGET_MAX = 99;
export const ROUND_SECONDS = 60;

export type Round = { numbers: number[]; target: number };

type Rng = () => number;

const randomInt = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

/** Deals a new round: five numbers from 1–10 and a two-digit target. */
export function newRound(rng: Rng = Math.random): Round {
  const numbers = Array.from({ length: NUMBER_COUNT }, () => randomInt(rng, NUMBER_MIN, NUMBER_MAX));
  return { numbers, target: randomInt(rng, TARGET_MIN, TARGET_MAX) };
}
