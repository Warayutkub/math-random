import { formatStep, type Step } from "@/lib/game/rules";

type Props = {
  title: string;
  steps: Step[];
  empty: string;
  tone?: "default" | "solution";
  best?: { value: number; distance: number };
};

export function StepsPanel({ title, steps, empty, tone = "default", best }: Props) {
  const solution = tone === "solution";
  return (
    <section className={`flex flex-col gap-sm rounded-[20px] p-lg ${solution ? "bg-surface-2" : "bg-surface"}`}>
      <h2 className={`text-caption font-semibold ${solution ? "text-primary" : "text-muted"}`}>{title}</h2>
      {steps.length > 0 ? (
        <ol className="flex flex-col gap-sm">
          {steps.map((step, i) => (
            <li key={i} className="text-step">
              {formatStep(step)}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-step">{empty}</p>
      )}
      {best && (
        <p className="text-caption text-muted">
          ใกล้สุดตอนนี้ <strong className="text-body font-bold text-primary">{best.value}</strong> ·{" "}
          {best.distance === 0 ? "พอดีเป๊ะ!" : `ห่าง ${best.distance}`}
        </p>
      )}
    </section>
  );
}
