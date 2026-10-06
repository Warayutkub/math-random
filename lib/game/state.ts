import { applyOp, type Op, type Step } from "./rules";
import { ROUND_SECONDS, type Round } from "./round";

export type Tile = { id: number; value: number; used: boolean };

export type EndReason = "submitted" | "timeout" | "gaveUp";

export type GameError = { message: string; seq: number };

export type GameState = {
  round: Round;
  /** Bumps on every new round so the deal animation replays. */
  dealId: number;
  /** True while the deal animation runs: the clock is stopped and moves are ignored. */
  dealing: boolean;
  tiles: Tile[];
  history: { tiles: Tile[]; step: Step }[];
  selectedId: number | null;
  op: Op | null;
  timeLeft: number;
  ended: EndReason | null;
  error: GameError | null;
};

export type Action =
  | { type: "pickTile"; id: number }
  | { type: "pickOp"; op: Op }
  | { type: "undo" }
  | { type: "reset" }
  | { type: "tick" }
  | { type: "end"; reason: EndReason }
  | { type: "newRound"; round: Round }
  | { type: "dealt" }
  | { type: "dismissError" };

const freshTiles = (numbers: number[]): Tile[] => numbers.map((value, id) => ({ id, value, used: false }));

export function initGame(round: Round, dealId = 0): GameState {
  return {
    round,
    dealId,
    dealing: true,
    tiles: freshTiles(round.numbers),
    history: [],
    selectedId: null,
    op: null,
    timeLeft: ROUND_SECONDS,
    ended: null,
    error: null,
  };
}

/** The player's answer is whichever number still on the board is closest to the target. */
export function bestTile(state: GameState): Tile {
  const open = state.tiles.filter((t) => !t.used);
  return open.reduce((best, t) =>
    Math.abs(t.value - state.round.target) < Math.abs(best.value - state.round.target) ? t : best,
  );
}

function pickTile(state: GameState, id: number): GameState {
  const tile = state.tiles.find((t) => t.id === id);
  if (!tile || tile.used) return state;

  if (state.selectedId === null || state.op === null) {
    // Choosing (or switching / clearing) the first number.
    return { ...state, selectedId: state.selectedId === id ? null : id, error: null };
  }
  if (state.selectedId === id) return { ...state, selectedId: null, op: null, error: null };

  const first = state.tiles.find((t) => t.id === state.selectedId)!;
  const result = applyOp(first.value, state.op, tile.value);
  if (result === null) {
    const message = state.op === "/" ? "หารไม่ลงตัว ลองตัวอื่นนะ" : "ผลลบต้องมากกว่า 0";
    return { ...state, error: { message, seq: (state.error?.seq ?? 0) + 1 } };
  }

  const tiles = state.tiles.map((t) =>
    t.id === first.id ? { ...t, used: true } : t.id === tile.id ? { ...t, value: result } : t,
  );
  const step: Step = { a: first.value, op: state.op, b: tile.value, result };
  return {
    ...state,
    tiles,
    history: [...state.history, { tiles: state.tiles, step }],
    // Keep the new number selected so the next step can chain from it.
    selectedId: tile.id,
    op: null,
    error: null,
  };
}

export function gameReducer(state: GameState, action: Action): GameState {
  if (action.type === "newRound") return initGame(action.round, state.dealId + 1);
  if (action.type === "dismissError") return { ...state, error: null };
  if (action.type === "dealt") return { ...state, dealing: false };
  if (state.ended || state.dealing) return state;

  switch (action.type) {
    case "pickTile":
      return pickTile(state, action.id);
    case "pickOp":
      if (state.selectedId === null) return state;
      return { ...state, op: state.op === action.op ? null : action.op, error: null };
    case "undo": {
      const last = state.history.at(-1);
      if (!last) return state;
      return { ...state, tiles: last.tiles, history: state.history.slice(0, -1), selectedId: null, op: null, error: null };
    }
    case "reset":
      return { ...state, tiles: freshTiles(state.round.numbers), history: [], selectedId: null, op: null, error: null };
    case "tick":
      if (state.timeLeft <= 1) return { ...state, timeLeft: 0, ended: "timeout" };
      return { ...state, timeLeft: state.timeLeft - 1 };
    case "end":
      return { ...state, ended: action.reason };
  }
}
