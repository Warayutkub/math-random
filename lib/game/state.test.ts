import { describe, expect, it } from "vitest";
import { ROUND_SECONDS } from "./round";
import { type Action, bestTile, gameReducer, type GameState, initGame } from "./state";

const round = { numbers: [3, 7, 8, 10, 5], target: 87 };
// Most tests start after the deal animation has finished.
const start = gameReducer(initGame(round), { type: "dealt" });
const play = (...actions: Action[]) => actions.reduce(gameReducer, start);
const values = (s: GameState) => s.tiles.filter((t) => !t.used).map((t) => t.value);

// Tile ids follow the dealt order: 3=0, 7=1, 8=2, 10=3, 5=4.
const eightTimesTen: Action[] = [{ type: "pickTile", id: 2 }, { type: "pickOp", op: "*" }, { type: "pickTile", id: 3 }];

describe("gameReducer", () => {
  it("combines two numbers into one and records the step", () => {
    const s = play(...eightTimesTen);
    expect(values(s)).toEqual([3, 7, 80, 5]);
    expect(s.history.map((h) => h.step)).toEqual([{ a: 8, op: "*", b: 10, result: 80 }]);
    expect(s.selectedId).toBe(3);
    expect(s.op).toBeNull();
  });

  it("chains steps from the new number", () => {
    const s = play(...eightTimesTen, { type: "pickOp", op: "+" }, { type: "pickTile", id: 1 });
    expect(values(s)).toEqual([3, 87, 5]);
    expect(bestTile(s).value).toBe(87);
  });

  it("rejects division that is not whole and keeps the board", () => {
    const s = play({ type: "pickTile", id: 1 }, { type: "pickOp", op: "/" }, { type: "pickTile", id: 0 });
    expect(s.error?.message).toMatch("หารไม่ลงตัว");
    expect(values(s)).toEqual(round.numbers);
  });

  it("rejects subtraction that is not positive", () => {
    const s = play({ type: "pickTile", id: 0 }, { type: "pickOp", op: "-" }, { type: "pickTile", id: 1 });
    expect(s.error?.message).toMatch("ผลลบ");
  });

  it("ignores an operator until a number is picked", () => {
    expect(play({ type: "pickOp", op: "+" }).op).toBeNull();
  });

  it("switches or clears the first number before an operator is chosen", () => {
    expect(play({ type: "pickTile", id: 0 }, { type: "pickTile", id: 1 }).selectedId).toBe(1);
    expect(play({ type: "pickTile", id: 0 }, { type: "pickTile", id: 0 }).selectedId).toBeNull();
    const cancelled = play({ type: "pickTile", id: 0 }, { type: "pickOp", op: "+" }, { type: "pickTile", id: 0 });
    expect(cancelled.selectedId).toBeNull();
    expect(cancelled.op).toBeNull();
  });

  it("does not let a used number be picked", () => {
    const s = play(...eightTimesTen, { type: "pickOp", op: "+" }, { type: "pickTile", id: 2 });
    expect(s.op).toBe("+");
    expect(s.history).toHaveLength(1);
  });

  it("undoes the last step and resets the board", () => {
    const two = play(...eightTimesTen, { type: "pickOp", op: "+" }, { type: "pickTile", id: 1 });
    expect(values(gameReducer(two, { type: "undo" }))).toEqual([3, 7, 80, 5]);
    expect(values(gameReducer(two, { type: "reset" }))).toEqual(round.numbers);
    expect(play({ type: "undo" })).toEqual(start);
  });

  it("ends when the timer runs out and then ignores moves", () => {
    const ticks: Action[] = Array.from({ length: ROUND_SECONDS }, () => ({ type: "tick" }));
    const s = play(...ticks);
    expect(s.timeLeft).toBe(0);
    expect(s.ended).toBe("timeout");
    expect(gameReducer(s, { type: "pickTile", id: 0 })).toBe(s);
  });

  it("ends on submit or give up, and a new round starts fresh", () => {
    expect(play({ type: "end", reason: "submitted" }).ended).toBe("submitted");
    const next = { numbers: [1, 2, 3, 4, 5], target: 50 };
    const s = gameReducer(play({ type: "end", reason: "gaveUp" }), { type: "newRound", round: next });
    expect(s).toEqual(initGame(next, 1));
    expect(s.dealing).toBe(true);
  });
});

describe("dealing", () => {
  it("starts every round dealing, with the clock stopped and moves ignored", () => {
    const dealing = initGame(round);
    expect(dealing.dealing).toBe(true);
    for (const a of [{ type: "tick" }, { type: "pickTile", id: 0 }, { type: "end", reason: "submitted" }] as Action[]) {
      expect(gameReducer(dealing, a)).toBe(dealing);
    }
  });

  it("lets play begin once the deal is done", () => {
    expect(start.dealing).toBe(false);
    expect(gameReducer(start, { type: "tick" }).timeLeft).toBe(ROUND_SECONDS - 1);
  });
});

describe("errors", () => {
  const badDivide: Action[] = [{ type: "pickTile", id: 1 }, { type: "pickOp", op: "/" }, { type: "pickTile", id: 0 }];

  it("numbers each error so a repeated mistake shows a fresh toast", () => {
    const once = play(...badDivide);
    const twice = gameReducer(once, { type: "pickTile", id: 0 });
    expect(once.error?.seq).toBe(1);
    expect(twice.error?.seq).toBe(2);
  });

  it("clears the error when dismissed or on the next good move", () => {
    const s = play(...badDivide);
    expect(gameReducer(s, { type: "dismissError" }).error).toBeNull();
    // 7 − 5 = 2 is allowed.
    const fixed = [{ type: "pickOp", op: "-" }, { type: "pickTile", id: 4 }] as Action[];
    expect(fixed.reduce(gameReducer, s).error).toBeNull();
  });
});

describe("bestTile", () => {
  it("picks the open number closest to the target", () => {
    expect(bestTile(initGame(round)).value).toBe(10);
  });
});
