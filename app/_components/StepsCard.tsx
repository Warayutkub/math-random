import { formatStep, type Step } from "@/lib/game/rules";

type Props = { title: string; steps: Step[]; empty?: string; footer?: string; error?: string | null; highlight?: boolean };

export function StepsCard({ title, steps, empty, footer, error, highlight = false }: Props) {
  return (
    <section
      className={`flex flex-col gap-sm rounded-lg p-lg ${highlight ? "bg-primary-50" : "border border-border bg-surface"}`}
    >
      <h2 className={`text-caption font-semibold ${highlight ? "text-primary" : "text-muted"}`}>{title}</h2>
      {steps.length > 0 ? (
        <ol className="flex flex-col gap-sm">
          {steps.map((step, i) => (
            <li key={i} className="font-display text-lg font-medium">
              {formatStep(step)}
            </li>
          ))}
        </ol>
      ) : (
        empty && <p className="text-body text-muted">{empty}</p>
      )}
      {footer && <p className="text-caption text-muted">{footer}</p>}
      {error !== undefined && (
        <p role="status" className="text-caption font-semibold text-error empty:hidden">
          {error ?? ""}
        </p>
      )}
    </section>
  );
}
