import { applyOp, OPS, type Step } from "./rules";

export type Solution = { value: number; distance: number; steps: Step[] };

type Item = { value: number; steps: Step[] };

/**
 * Tries every way to combine the numbers with + − × ÷ (each number used at most
 * once, not all required) and returns the result closest to the target.
 * Ties go to the solution with fewer steps.
 */
export function solve(numbers: number[], target: number): Solution {
  let best: Solution = { value: Number.NaN, distance: Infinity, steps: [] };

  const consider = ({ value, steps }: Item) => {
    const distance = Math.abs(value - target);
    if (distance < best.distance || (distance === best.distance && steps.length < best.steps.length)) {
      best = { value, distance, steps };
    }
  };

  const search = (items: Item[]) => {
    items.forEach(consider);
    if (best.distance === 0 && best.steps.length === 0) return;

    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items.length; j++) {
        if (i === j) continue;
        const x = items[i];
        const y = items[j];
        for (const op of OPS) {
          // + and × are commutative: try each pair once.
          if ((op === "+" || op === "*") && j < i) continue;
          // Multiplying or dividing by 1 never gets closer; skip to keep steps short.
          if ((op === "*" || op === "/") && (x.value === 1 || y.value === 1)) continue;
          const result = applyOp(x.value, op, y.value);
          if (result === null) continue;
          const step: Step = { a: x.value, op, b: y.value, result };
          const rest = items.filter((_, k) => k !== i && k !== j);
          search([...rest, { value: result, steps: [...x.steps, ...y.steps, step] }]);
        }
      }
    }
  };

  search(numbers.map((value) => ({ value, steps: [] })));
  return best;
}
