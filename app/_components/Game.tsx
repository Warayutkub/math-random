"use client";

import { useEffect, useMemo, useReducer } from "react";
import { Button } from "@/components/ui/Button";
import { OPS } from "@/lib/game/rules";
import { newRound, ROUND_SECONDS, type Round } from "@/lib/game/round";
import { solve } from "@/lib/game/solver";
import { bestTile, gameReducer, initGame } from "@/lib/game/state";
import { NumberTile } from "./NumberTile";
import { OperatorButton } from "./OperatorButton";
import { ResultCard } from "./ResultCard";
import { StepsCard } from "./StepsCard";
import { TargetCard } from "./TargetCard";

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function Game({ initialRound }: { initialRound: Round }) {
  const [state, dispatch] = useReducer(gameReducer, initialRound, initGame);
  const { round, tiles, history, selectedId, op, timeLeft, ended, error } = state;

  useEffect(() => {
    if (ended) return;
    const timer = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(timer);
  }, [ended, round]);

  const solution = useMemo(() => (ended ? solve(round.numbers, round.target) : null), [ended, round]);
  const best = bestTile(state);
  const distance = Math.abs(best.value - round.target);
  const lowTime = timeLeft <= 10 && !ended;

  return (
    <main className="mx-auto flex w-full max-w-240 flex-col gap-xl px-5 pt-xl pb-2xl lg:gap-2xl lg:px-3xl lg:pt-3xl">
      <header className="flex items-center justify-between gap-lg">
        <div>
          <h1 className="font-display text-heading-h1">เลขใกล้เคียง</h1>
          <p className="text-caption text-muted">ใช้ + − × ÷ ให้ได้ใกล้เป้าที่สุด</p>
        </div>
        <p
          aria-label={ended ? "จบรอบ" : `เหลือเวลา ${timeLeft} วินาที`}
          className={`rounded-full px-3.5 py-1.5 font-display text-lg font-semibold tabular-nums ${
            ended ? "bg-border text-muted" : lowTime ? "bg-accent-50 text-accent" : "bg-primary-50 text-primary"
          }`}
        >
          {ended ? "จบรอบ" : formatTime(timeLeft)}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr] lg:gap-2xl">
        <div className="flex flex-col gap-5">
          {!ended && (
            <div
              role="progressbar"
              aria-label="เวลาที่เหลือ"
              aria-valuemin={0}
              aria-valuemax={ROUND_SECONDS}
              aria-valuenow={timeLeft}
              className="h-2 overflow-hidden rounded-full bg-border"
            >
              <div
                className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${lowTime ? "bg-accent" : "bg-primary"}`}
                style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
              />
            </div>
          )}
          <TargetCard target={round.target} compact={!!ended} />
        </div>

        <div className="flex flex-col gap-5">
          {ended && solution ? (
            <>
              <ResultCard answer={best.value} distance={distance} reason={ended} />
              <StepsCard
                highlight
                title={solution.distance === 0 ? `เฉลย · ได้ ${solution.value} พอดี` : `เฉลย · ใกล้สุดได้ ${solution.value} (ห่าง ${solution.distance})`}
                steps={solution.steps}
                empty={`ใช้เลข ${solution.value} ได้เลย`}
              />
              <StepsCard title="ขั้นตอนของคุณ" steps={history.map((h) => h.step)} empty="ยังไม่ได้คำนวณ" />
              <Button onClick={() => dispatch({ type: "newRound", round: newRound() })}>เล่นรอบใหม่</Button>
            </>
          ) : (
            <>
              <div className="flex justify-between gap-sm">
                {tiles.map((t) => (
                  <NumberTile
                    key={t.id}
                    value={t.value}
                    state={t.used ? "used" : t.id === selectedId ? "selected" : "default"}
                    onClick={() => dispatch({ type: "pickTile", id: t.id })}
                  />
                ))}
              </div>
              <div className="flex gap-sm">
                {OPS.map((o) => (
                  <OperatorButton
                    key={o}
                    op={o}
                    selected={op === o}
                    disabled={selectedId === null}
                    onClick={() => dispatch({ type: "pickOp", op: o })}
                  />
                ))}
              </div>
              <StepsCard
                error={error}
                title="ขั้นตอนของคุณ"
                steps={history.map((h) => h.step)}
                empty="แตะตัวเลข → เครื่องหมาย → ตัวเลขอีกตัว"
                footer={`ใกล้สุดตอนนี้ ${best.value} · ${distance === 0 ? "พอดีเป๊ะ!" : `ห่าง ${distance}`}`}
              />
              <div className="flex flex-col gap-sm">
                <div className="flex gap-sm">
                  <Button variant="secondary" className="flex-1" disabled={history.length === 0} onClick={() => dispatch({ type: "undo" })}>
                    ย้อนกลับ
                  </Button>
                  <Button variant="secondary" className="flex-1" disabled={history.length === 0} onClick={() => dispatch({ type: "reset" })}>
                    เริ่มใหม่
                  </Button>
                </div>
                <Button onClick={() => dispatch({ type: "end", reason: "submitted" })}>ส่งคำตอบ</Button>
                <Button variant="ghost" onClick={() => dispatch({ type: "end", reason: "gaveUp" })}>
                  ยอมแพ้ · ดูเฉลย
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
