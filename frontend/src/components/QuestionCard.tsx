
import type { Question } from "../lib/api";
import { roundLabel } from "../lib/roundTypes";
import { cn } from "../lib/utils";
import { SpeedTimer } from "./SpeedTimer";

interface Props {
  question: Question;
  selectedLabel?: string | null;
  revealed?: boolean;
  onSelect?: (label: string) => void;
  onTimeUp?: () => void;
}

/**
 * Hexagon question card inspired by the uploaded design.
 * Left: big hex with the question. Right: stacked hex answer chips.
 * For rounds without options, right side shows meta / hints / reveal panel.
 */
export function QuestionCard({ question, selectedLabel, revealed, onSelect, onTimeUp }: Props) {
  const hasOptions = (question.options?.length ?? 0) > 0;
  const isSpeed = question.round === "speed_round" && !!question.timeLimit;

  return (
    <div className="relative w-full max-w-6xl mx-auto p-6 md:p-10 rounded-2xl bg-quiz-grid border border-(--gold)/20">
      {/* corner tick marks */}
      <CornerTicks />

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 items-center">
        {/* Question hex */}
        <div className="relative">
          <div className="relative aspect-[1.2/1] w-full">
            <div className="absolute inset-0 hex-clip bg-(--gold)/90" />
            <div className="absolute inset-0.75 hex-clip bg-[radial-gradient(ellipse_at_center,#3a0f6a_0%,#1e0640_100%)]" />
            <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16 text-center">
              <div>
                <div className="mb-3 text-[10px] tracking-[0.35em] text-(--gold)/80 font-display">
                  {roundLabel(question.round)}
                  {question.category ? <> · {question.category}</> : null}
                </div>
                <p className="font-display font-bold text-lg md:text-2xl leading-snug text-white">
                  {question.question}
                </p>
              </div>
            </div>
            <GoldFlare className="left-2 top-1/2 -translate-y-1/2" />
            <GoldFlare className="right-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Answers / reveal */}
        <div className="flex flex-col gap-4">
          {isSpeed && onTimeUp && (
            <SpeedTimer
              seconds={question.timeLimit!}
              runKey={`${question._id}-${revealed ? "r" : "l"}`}
              paused={!!revealed}
              onExpire={onTimeUp}
            />
          )}
          {hasOptions ? (
            question.options!.map((opt) => {
              const isSelected = selectedLabel === opt.label;
              const isCorrect = revealed && opt.label === question.correctAnswer;
              const isWrong = revealed && isSelected && !isCorrect;
              return (
                <AnswerChip
                  key={opt.label}
                  label={opt.label}
                  text={opt.text}
                  state={
                    isCorrect ? "correct" : isWrong ? "wrong" : isSelected ? "selected" : "idle"
                  }
                  onClick={() => onSelect?.(opt.label)}
                />
              );
            })
          ) : (
            <NoOptionsPanel question={question} revealed={!!revealed} />
          )}
        </div>
      </div>
    </div>
  );
}

function AnswerChip({
  label,
  text,
  state,
  onClick,
}: {
  label: string;
  text: string;
  state: "idle" | "selected" | "correct" | "wrong";
  onClick?: () => void;
}) {
  const stateClasses = {
    idle: "bg-[color:var(--gold)]/80 hover:bg-[color:var(--gold)]",
    selected: "bg-[color:var(--cyan)] glow-cyan",
    correct: "bg-emerald-400 glow-cyan",
    wrong: "bg-rose-500",
  }[state];

  return (
    <button onClick={onClick} className="group relative h-16 md:h-17 w-full text-left">
      <div className={cn("absolute inset-0 answer-clip transition-colors", stateClasses)} />
      <div className="absolute inset-0.5 answer-clip bg-[radial-gradient(ellipse_at_center,#3a0f6a_0%,#1e0640_100%)]" />
      <div className="relative h-full flex items-center gap-4 pl-6 pr-8">
        <span
          className={cn(
            "grid place-items-center h-8 w-8 rounded-full font-display font-bold text-sm",
            state === "correct"
              ? "bg-emerald-400 text-purple-deep"
              : state === "wrong"
                ? "bg-rose-500 text-white"
                : state === "selected"
                  ? "bg-cyan text-purple-deep"
                  : "bg-gold text-purple-deep",
          )}
        >
          {label}
        </span>
        <span className="font-display font-bold text-base md:text-lg text-white truncate">
          {text}
        </span>
      </div>
      <GoldFlare className="left-2 top-1/2 -translate-y-1/2 group-hover:animate-flicker" />
    </button>
  );
}

function NoOptionsPanel({ question, revealed }: { question: Question; revealed: boolean }) {
  return (
    <div className="rounded-xl border border-(--gold)/40 bg-black/25 p-5 space-y-4">
      {question.timeLimit ? (
        <div className="font-display text-sm text-cyan">
          ⏱ Time limit: {question.timeLimit}s
        </div>
      ) : null}

      {question.hints?.length ? (
        <div>
          <div className="text-[10px] tracking-[0.3em] text-gold font-display mb-2">
            HINTS
          </div>
          <ul className="space-y-1.5 text-sm text-white/85">
            {question.hints.map((h, i) => (
              <li key={i}>• {h}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-white/70 text-sm">
          Players answer without options. Reveal when ready.
        </p>
      )}

      <div className="pt-2 border-t border-white/10">
        <div className="text-[10px] tracking-[0.3em] text-gold font-display mb-1">
          ANSWER
        </div>
        {revealed ? (
          <p className="font-display font-bold text-xl text-emerald-300">
            {question.correctAnswer}
          </p>
        ) : (
          <p className="italic text-white/50">— hidden —</p>
        )}
      </div>
    </div>
  );
}

function CornerTicks() {
  return (
    <>
      {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((c) => (
        <div key={c} className={cn("absolute w-6 h-6 border-gold", c)}>
          <div className="w-full h-0.5 bg-gold" />
          <div className="w-0.5 h-full bg-gold absolute top-0 left-0" />
        </div>
      ))}
    </>
  );
}

function GoldFlare({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute w-14 h-2 rounded-full blur-[6px] bg-(--gold)/80 animate-flicker",
        className,
      )}
    />
  );
}
