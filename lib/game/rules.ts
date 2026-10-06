export type Op = "+" | "-" | "*" | "/";

export const OPS: Op[] = ["+", "-", "*", "/"];

export const OP_SYMBOL: Record<Op, string> = { "+": "+", "-": "−", "*": "×", "/": "÷" };

export type Step = { a: number; op: Op; b: number; result: number };

/**
 * Applies one operation under the game rules: every intermediate value must be
 * a positive whole number, so `a - b` needs a > b and `a / b` must divide evenly.
 * Returns null when the move is not allowed.
 */
export function applyOp(a: number, op: Op, b: number): number | null {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a > b ? a - b : null;
    case "*":
      return a * b;
    case "/":
      return b !== 0 && a % b === 0 ? a / b : null;
  }
}

export function formatStep({ a, op, b, result }: Step): string {
  return `${a} ${OP_SYMBOL[op]} ${b} = ${result}`;
}
