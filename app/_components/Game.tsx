"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import { OPS } from "@/lib/game/rules";
import { newRound, ROUND_SECONDS, type Round } from "@/lib/game/round";
import { solve } from "@/lib/game/solver";
import { bestTile, gameReducer, initGame } from "@/lib/game/state";
import { Header } from "./Header";
import { NumberTile } from "./NumberTile";
import { OperatorButton } from "./OperatorButton";
import { ResultPanel } from "./ResultPanel";
import { StepsPanel } from "./StepsPanel";
import { TARGET_DEAL_MS, TargetBoard } from "./TargetBoard";
import { TimerPill } from "./TimerPill";

const LOW_TIME = 10;
/** Deal length including the landing bounce. */
const DEAL_MS = TARGET_DEAL_MS + 150;

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function Game({ initialRound }: { initialRound: Round }) {
  const [state, dispatch] = useReducer(gameReducer, initialRound, initGame);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const { round, dealId, dealing, tiles, history, selectedId, op, timeLeft, ended, error } = state;

  // Deal animation, then start the clock. Reduced motion skips straight to play.
  useEffect(() => {
    if (!dealing) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => dispatch({ type: "dealt" }), reduced ? 0 : DEAL_MS);
    return () => clearTimeout(timer);
  }, [dealing, dealId]);

  // The clock pauses while the give-up dialog asks for a decision.
  useEffect(() => {
    if (dealing || ended || confirmGiveUp) return;
    const timer = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(timer);
  }, [dealing, ended, confirmGiveUp]);

  const dismissError = useCallback(() => dispatch({ type: "dismissError" }), []);
  const solution = useMemo(() => (ended ? solve(round.numbers, round.target) : null), [ended, round]);
  const best = bestTile(state);
  const distance = Math.abs(best.value - round.target);
  const lowTime = timeLeft <= LOW_TIME;

  const timer = dealing
    ? { state: "ended" as const, label: "สุ่ม…", aria: "กำลังสุ่มตัวเลข" }
    : ended
      ? { state: "ended" as const, label: "จบรอบ", aria: "จบรอบ" }
      : { state: lowTime ? ("low" as const) : ("normal" as const), label: formatTime(timeLeft), aria: `เหลือเวลา ${timeLeft} วินาที` };

  return (
    <main className="mx-auto flex w-full max-w-240 flex-col gap-5 px-5 pt-xl pb-2xl lg:gap-2xl lg:px-3xl lg:pt-3xl">
      <Header>
        <TimerPill state={timer.state} label={timer.label} ariaLabel={timer.aria} />
      </Header>

      <div className="grid gap-5 lg:grid-cols-[400px_1fr] lg:gap-2xl">
        <div className="flex flex-col gap-5">
          {!ended && (
            <div
              role="progressbar"
              aria-label="เวลาที่เหลือ"
              aria-valuemin={0}
              aria-valuemax={ROUND_SECONDS}
              aria-valuenow={timeLeft}
              className="h-2.5 overflow-hidden rounded-full bg-surface-2"
            >
              <div
                className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${lowTime ? "bg-plus" : "bg-minus"}`}
                style={{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }}
              />
            </div>
          )}
          <TargetBoard target={round.target} compact={!!ended} dealSeed={dealing ? dealId : undefined} />
          {ended && solution && <ResultPanel answer={best.value} distance={distance} reason={ended} />}
        </div>

        <div className="flex flex-col gap-5">
          {ended && solution ? (
            <>
              <StepsPanel
                tone="solution"
                title={solution.distance === 0 ? `เฉลย · ได้ ${solution.value} พอดี` : `เฉลย · ใกล้สุดได้ ${solution.value} (ห่าง ${solution.distance})`}
                steps={solution.steps}
                empty={`ใช้เลข ${solution.value} ได้เลย`}
              />
              <StepsPanel title="ขั้นตอนของคุณ" steps={history.map((h) => h.step)} empty="ยังไม่ได้คำนวณ" />
              <Button onClick={() => dispatch({ type: "newRound", round: newRound() })}>เล่นรอบใหม่</Button>
            </>
          ) : (
            <>
              <div className="flex justify-between gap-sm pb-1.5">
                {tiles.map((t, i) => (
                  <NumberTile
                    key={t.id}
                    value={t.value}
                    state={t.used ? "used" : t.id === selectedId ? "selected" : "default"}
                    onClick={() => dispatch({ type: "pickTile", id: t.id })}
                    deal={dealing ? { index: i, seed: dealId } : undefined}
                  />
                ))}
              </div>
              <div className="flex gap-sm pb-[5px]">
                {OPS.map((o) => (
                  <OperatorButton
                    key={o}
                    op={o}
                    selected={op === o}
                    disabled={dealing || selectedId === null}
                    onClick={() => dispatch({ type: "pickOp", op: o })}
                  />
                ))}
              </div>
              <StepsPanel
                title="ขั้นตอนของคุณ"
                steps={history.map((h) => h.step)}
                empty={dealing ? "กำลังสุ่มตัวเลข…" : "แตะตัวเลข → เครื่องหมาย → ตัวเลขอีกตัว"}
                best={dealing ? undefined : { value: best.value, distance }}
              />
              <div className="flex flex-col gap-md">
                <div className="flex gap-md">
                  <Button variant="secondary" className="flex-1" disabled={history.length === 0} onClick={() => dispatch({ type: "undo" })}>
                    ย้อนกลับ
                  </Button>
                  <Button variant="secondary" className="flex-1" disabled={history.length === 0} onClick={() => dispatch({ type: "reset" })}>
                    เริ่มใหม่
                  </Button>
                </div>
                <Button disabled={dealing} onClick={() => dispatch({ type: "end", reason: "submitted" })}>
                  ส่งคำตอบ
                </Button>
                <Button variant="ghost" disabled={dealing} onClick={() => setConfirmGiveUp(true)}>
                  ยอมแพ้ · ดูเฉลย
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {error && <Toast key={error.seq} message={error.message} onDismiss={dismissError} />}
      <ConfirmDialog
        open={confirmGiveUp && !ended}
        title="ยอมแพ้รอบนี้?"
        body="ระบบจะเฉลยคำตอบและจบรอบทันที"
        cancelLabel="เล่นต่อ"
        confirmLabel="ยอมแพ้"
        onCancel={() => setConfirmGiveUp(false)}
        onConfirm={() => {
          setConfirmGiveUp(false);
          dispatch({ type: "end", reason: "gaveUp" });
        }}
      />
    </main>
  );
}
