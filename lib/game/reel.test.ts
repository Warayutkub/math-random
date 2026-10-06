import { describe, expect, it } from "vitest";
import { REEL_LENGTH, reelValues } from "./reel";

describe("reelValues", () => {
  it("ends on the real number and stays inside the range", () => {
    for (let final = 1; final <= 10; final++) {
      const values = reelValues(final, final, 1, 10);
      expect(values).toHaveLength(REEL_LENGTH);
      expect(values.at(-1)).toBe(final);
      expect(Math.min(...values)).toBeGreaterThanOrEqual(1);
      expect(Math.max(...values)).toBeLessThanOrEqual(10);
    }
  });

  it("never shows the same number twice in a row", () => {
    for (let seed = 0; seed < 50; seed++) {
      const values = reelValues(seed % 10 + 1, seed, 1, 10);
      values.slice(1).forEach((v, i) => expect(v).not.toBe(values[i]));
    }
  });

  it("is deterministic so server and browser render the same reel", () => {
    expect(reelValues(87, 3, 20, 99)).toEqual(reelValues(87, 3, 20, 99));
  });
});
