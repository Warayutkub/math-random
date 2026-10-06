type Props = { target: number; compact?: boolean };

export function TargetCard({ target, compact = false }: Props) {
  return (
    <section
      aria-label="เป้าหมาย"
      className={`flex flex-col items-center rounded-xl bg-accent-50 text-center ${compact ? "p-lg" : "p-xl"}`}
    >
      <p className="text-caption font-semibold text-accent">เป้าหมาย</p>
      <p className={`font-display font-bold leading-[1.1] text-accent ${compact ? "text-5xl" : "text-display"}`}>
        {target}
      </p>
      <p className="text-caption text-muted">ทำให้ได้ใกล้เคียงที่สุด</p>
    </section>
  );
}
