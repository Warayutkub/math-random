import { OP_SYMBOL, type Op } from "@/lib/game/rules";

const OP_STYLE: Record<Op, { label: string; className: string }> = {
  "+": { label: "บวก", className: "bg-plus [--edge:var(--color-plus-edge)]" },
  "-": { label: "ลบ", className: "bg-minus [--edge:var(--color-minus-edge)]" },
  "*": { label: "คูณ", className: "bg-times [--edge:var(--color-times-edge)]" },
  "/": { label: "หาร", className: "bg-divide [--edge:var(--color-divide-edge)]" },
};

type Props = { op: Op; selected: boolean; disabled: boolean; onClick: () => void };

export function OperatorButton({ op, selected, disabled, onClick }: Props) {
  const { label, className } = OP_STYLE[op];
  const state = selected
    ? "translate-y-[5px] ring-4 ring-text ring-inset"
    : "shadow-[0_5px_0_var(--edge)] active:translate-y-[5px] active:shadow-none disabled:active:translate-y-0";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={label}
      className={`flex h-15 flex-1 items-center justify-center rounded-full text-[44px] leading-none font-bold text-on-primary transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-text disabled:cursor-not-allowed disabled:opacity-35 ${className} ${state}`}
    >
      {OP_SYMBOL[op]}
    </button>
  );
}
