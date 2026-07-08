import { useMemo, useState } from "react";

import { toast } from "sonner";
import type { QuestionOption, NewQuestion } from "../../lib/api";
import { type RoundId, roundsWithOptions, ROUND_TYPES } from "../../lib/roundTypes";
import { useAppDispatch } from "../../store";
import { createQuestion } from "../../store/questionsSlice";

const LABELS = ["a", "b", "c", "d", "e", "f"];

export function AdminQuestionForm() {
  const dispatch = useAppDispatch();
  const [round, setRound] = useState<RoundId>("multiple_choice");
  const [category, setCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [numOptions, setNumOptions] = useState(4);
  const [options, setOptions] = useState<QuestionOption[]>(
    LABELS.slice(0, 4).map((l) => ({ label: l, text: "" })),
  );
  const [hintsRaw, setHintsRaw] = useState("");
  const [timeLimit, setTimeLimit] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  const usesOptions = roundsWithOptions.includes(round);
  const roundMeta = useMemo(() => ROUND_TYPES.find((r) => r.id === round)!, [round]);

  function updateOption(i: number, text: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, text } : o)));
  }

  function changeNumOptions(n: number) {
    setNumOptions(n);
    setOptions(
      LABELS.slice(0, n).map((l, i) => options[i] ?? { label: l, text: "" }),
    );
  }

  function reset() {
    setQuestion("");
    setCorrectAnswer("");
    setOptions(LABELS.slice(0, numOptions).map((l) => ({ label: l, text: "" })));
    setHintsRaw("");
    setTimeLimit("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !correctAnswer.trim() || !category.trim()) {
      toast.error("Question, category, and correct answer are required");
      return;
    }
    if (usesOptions) {
      if (options.some((o) => !o.text.trim())) {
        toast.error("Fill in all options");
        return;
      }
      if (!options.some((o) => o.label === correctAnswer)) {
        toast.error("Correct answer must match one of the option letters (a, b, c…)");
        return;
      }
    }
    const payload: NewQuestion = {
      round,
      category: category.trim(),
      question: question.trim(),
      correctAnswer: correctAnswer.trim(),
      options: usesOptions ? options.map((o) => ({ ...o, text: o.text.trim() })) : undefined,
      hints: hintsRaw
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean),
      timeLimit: round === "speed_round" && typeof timeLimit === "number" ? timeLimit : undefined,
    };
    try {
      setSaving(true);
      await dispatch(createQuestion(payload)).unwrap();
      toast.success("Question saved");
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-(--gold)/30 bg-black/30 p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Round">
          <select
            value={round}
            onChange={(e) => setRound(e.target.value as RoundId)}
            className={inputCls}
          >
            {ROUND_TYPES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-white/60 mt-1">{roundMeta.hint}</p>
        </Field>
        <Field label="Category / Section">
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Geography"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Question">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          className={inputCls}
          placeholder="Which country is the largest producer of olive oil?"
        />
      </Field>

      {usesOptions ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm text-gold">Options</span>
            <select
              value={numOptions}
              onChange={(e) => changeNumOptions(Number(e.target.value))}
              className={inputCls + " w-24"}
            >
              {[2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          {options.map((o, i) => (
            <div key={o.label} className="flex items-center gap-3">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-gold text-purple-deep font-display font-bold">
                {o.label}
              </span>
              <input
                value={o.text}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${o.label}`}
                className={inputCls}
              />
            </div>
          ))}
          <Field label="Correct option letter">
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className={inputCls}
            >
              <option value="">— select —</option>
              {options.map((o) => (
                <option key={o.label} value={o.label}>
                  {o.label.toUpperCase()} · {o.text || "(empty)"}
                </option>
              ))}
            </select>
          </Field>
        </div>
      ) : (
        <Field label="Correct answer">
          <input
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="The exact answer"
            className={inputCls}
          />
        </Field>
      )}

      <Field label="Hints (one per line — optional)">
        <textarea
          value={hintsRaw}
          onChange={(e) => setHintsRaw(e.target.value)}
          rows={3}
          className={inputCls}
          placeholder={
            round === "cross_reference"
              ? "Clue 1\nClue 2\nClue 3"
              : "Optional hints"
          }
        />
      </Field>

      {round === "speed_round" ? (
        <Field label="Time limit (seconds)">
          <input
            type="number"
            min={5}
            max={120}
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value ? Number(e.target.value) : "")}
            className={inputCls}
            placeholder="15"
          />
        </Field>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="w-full h-11 rounded-lg bg-gold text-purple-deep font-display font-bold tracking-wider glow-gold disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Question"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg bg-black/40 border border-[color:var(--gold)]/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[color:var(--cyan)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-display text-xs tracking-[0.25em] text-gold mb-1.5">
        {label.toUpperCase()}
      </span>
      {children}
    </label>
  );
}
