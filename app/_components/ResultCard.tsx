import type { EndReason } from "@/lib/game/state";

const REASON_LABEL: Record<EndReason, string> = {
  submitted: "คำตอบของคุณ",
  timeout: "หมดเวลา! คำตอบของคุณ",
  gaveUp: "ยอมแพ้ · เลขที่ใกล้สุดของคุณ",
};

function verdict(distance: number) {
  if (distance === 0) return { text: "พอดีเป๊ะ! สุดยอด", className: "bg-success/10 text-success" };
  if (distance <= 5) return { text: `ห่างแค่ ${distance} · เก่งมาก!`, className: "bg-success/10 text-success" };
  return { text: `ห่าง ${distance} · ลองใหม่นะ`, className: "bg-border text-muted" };
}

type Props = { answer: number; distance: number; reason: EndReason };

export function ResultCard({ answer, distance, reason }: Props) {
  const v = verdict(distance);
  return (
    <section className="flex flex-col items-center gap-xs rounded-xl border border-border bg-surface p-xl text-center">
      <h2 className="text-caption font-semibold text-muted">{REASON_LABEL[reason]}</h2>
      <p className="font-display text-5xl font-bold leading-[1.1] text-primary">{answer}</p>
      <p className={`rounded-full px-md py-xs text-caption font-semibold ${v.className}`}>{v.text}</p>
    </section>
  );
}
