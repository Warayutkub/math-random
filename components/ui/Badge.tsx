type Tone = "success" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  success: "bg-success text-on-primary",
  neutral: "bg-surface-2 text-muted",
};

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <p className={`rounded-full px-3.5 py-xs text-caption font-semibold ${TONE_CLASS[tone]}`}>{children}</p>;
}
