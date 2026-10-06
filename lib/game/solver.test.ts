import { describe, expect, it } from "vitest";
import { applyOp } from "./rules";
import { newRound } from "./round";
import { solve } from "./solver";

/** Replays the steps to prove the solution only uses the given numbers, each once. */
function replay(numbers: number[], steps: ReturnType<typeof solve>["steps"]) {
  const pool = [...numbers];
  const take = (n: number) => {
    const i = pool.indexOf(n);
    expect(i, `${n} is available`).toBeGreaterThanOrEqual(0);
    pool.splice(i, 1);
  };
  for (const s of steps) {
    take(s.a);
    take(s.b);
    expect(applyOp(s.a, s.op, s.b)).toBe(s.result);
    pool.push(s.result);
  }
}

describe("solve", () => {
  it("finds an exact answer", () => {
    const sol = solve([3, 7, 8, 10, 5], 87);
    expect(sol.distance).toBe(0);
    expect(sol.value).toBe(87);
    replay([3, 7, 8, 10, 5], sol.steps);
  });

  it("needs no steps when a number already equals the target", () => {
    expect(solve([1, 2, 42, 4, 5], 42)).toEqual({ value: 42, distance: 0, steps: [] });
  });

  it("returns the closest result when the target is unreachable", () => {
    // (1+1+1) × (1+1) = 6 is the most these numbers can make.
    const sol = solve([1, 1, 1, 1, 1], 99);
    expect(sol.value).toBe(6);
    expect(sol.distance).toBe(93);
    replay([1, 1, 1, 1, 1], sol.steps);
  });

  it("prefers the shorter solution on a tie", () => {
    const sol = solve([2, 5, 9, 1, 1], 10);
    expect(sol.distance).toBe(0);
    expect(sol.steps).toHaveLength(1);
  });

  it("always returns a valid solution for random rounds", () => {
    let seed = 7;
    const rng = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < 20; i++) {
      const { numbers, target } = newRound(rng);
      const sol = solve(numbers, target);
      replay(numbers, sol.steps);
      expect(sol.distance).toBe(Math.abs(sol.value - target));
    }
  });
});
