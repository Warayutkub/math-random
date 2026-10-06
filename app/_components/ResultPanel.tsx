import { Badge } from "@/components/ui/Badge";
import type { EndReason } from "@/lib/game/state";

const REASON_LABEL: Record<EndReason, string> = {
  submitted: "คำตอบของคุณ",
  timeout: "หมดเวลา! คำตอบของคุณ",
  gaveUp: "เลขที่ใกล้สุดของคุณ",
};

function verdict(distance: number) {
  if (distance === 0) return { headline: "เป๊ะ! สุดยอด", badge: "ตรงเป้าพอดี", tone: "success" as const };
  if (distance <= 5) return { headline: "เกือบเป๊ะ!", badge: `ห่างแค่ ${distance} · เก่งมาก!`, tone: "success" as const };
  return { headline: "ไม่เป็นไร ลองใหม่!", badge: `ห่าง ${distance}`, tone: "neutral" as const };
}

type Props = { answer: number; distance: number; reason: EndReason };

export function ResultPanel({ answer, distance, reason }: Props) {
  const v = verdict(distance);
  return (
    <section className="flex flex-col items-center gap-sm rounded-xl bg-surface p-xl text-center">
      <h2 className="text-heading-h2 text-primary">{v.headline}</h2>
      <p className="text-caption text-muted">{REASON_LABEL[reason]}</p>
      <p className="text-score">{answer}</p>
      <Badge tone={v.tone}>{v.badge}</Badge>
    </section>
  );
}
