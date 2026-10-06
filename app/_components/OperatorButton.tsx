import { OP_SYMBOL, type Op } from "@/lib/game/rules";

const OP_LABEL: Record<Op, string> = { "+": "บวก", "-": "ลบ", "*": "คูณ", "/": "หาร" };

type Props = { op: Op; selected: boolean; disabled: boolean; onClick: () => void };

export function OperatorButton({ op, selected, disabled, onClick }: Props) {
  const state = selected
    ? "bg-primary text-on-primary"
    : "bg-primary-50 text-primary hover:bg-primary-100 disabled:opacity-40 disabled:hover:bg-primary-50";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={OP_LABEL[op]}
      className={`flex h-14 flex-1 items-center justify-center rounded-md font-display text-tile transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed ${state}`}
    >
      {OP_SYMBOL[op]}
    </button>
  );
}
