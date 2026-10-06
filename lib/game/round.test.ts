import { describe, expect, it } from "vitest";
import { NUMBER_COUNT, newRound, NUMBER_MAX, NUMBER_MIN, TARGET_MAX, TARGET_MIN } from "./round";

describe("newRound", () => {
  it("deals five numbers and a target inside the configured ranges", () => {
    for (const r of [0, 0.5, 0.999999]) {
      const { numbers, target } = newRound(() => r);
      expect(numbers).toHaveLength(NUMBER_COUNT);
      numbers.forEach((n) => {
        expect(n).toBeGreaterThanOrEqual(NUMBER_MIN);
        expect(n).toBeLessThanOrEqual(NUMBER_MAX);
      });
      expect(target).toBeGreaterThanOrEqual(TARGET_MIN);
      expect(target).toBeLessThanOrEqual(TARGET_MAX);
    }
  });

  it("hits both ends of each range", () => {
    expect(newRound(() => 0)).toEqual({ numbers: [1, 1, 1, 1, 1], target: TARGET_MIN });
    expect(newRound(() => 0.999999)).toEqual({ numbers: [10, 10, 10, 10, 10], target: TARGET_MAX });
  });
});
