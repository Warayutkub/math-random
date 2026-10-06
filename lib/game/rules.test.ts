import { describe, expect, it } from "vitest";
import { applyOp, formatStep } from "./rules";

describe("applyOp", () => {
  it("adds and multiplies", () => {
    expect(applyOp(3, "+", 4)).toBe(7);
    expect(applyOp(3, "*", 4)).toBe(12);
  });

  it("only subtracts when the result stays positive", () => {
    expect(applyOp(9, "-", 4)).toBe(5);
    expect(applyOp(4, "-", 4)).toBeNull();
    expect(applyOp(4, "-", 9)).toBeNull();
  });

  it("only divides when it divides evenly", () => {
    expect(applyOp(12, "/", 4)).toBe(3);
    expect(applyOp(10, "/", 4)).toBeNull();
    expect(applyOp(10, "/", 0)).toBeNull();
  });
});

describe("formatStep", () => {
  it("uses the math symbols players see", () => {
    expect(formatStep({ a: 8, op: "*", b: 10, result: 80 })).toBe("8 × 10 = 80");
    expect(formatStep({ a: 9, op: "-", b: 4, result: 5 })).toBe("9 − 4 = 5");
  });
});
