import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { ROUND_TYPES, roundLabel } from "../../lib/roundTypes";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchQuestions, setFilterRound, setFilterCategory, deleteQuestion } from "../../store/questionsSlice";

export function QuestionList() {
  const dispatch = useAppDispatch();
  const { items, loading, error, filterRound, filterCategory } = useAppSelector((s) => s.questions);

  useEffect(() => {
    dispatch(fetchQuestions({ round: filterRound || undefined, category: filterCategory || undefined }));
  }, [dispatch, filterRound, filterCategory]);

  const categories = Array.from(new Set(items.map((q) => q.category))).sort();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={filterRound}
          onChange={(e) => dispatch(setFilterRound(e.target.value))}
          className={inputCls}
        >
          <option value="">All rounds</option>
          {ROUND_TYPES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => dispatch(setFilterCategory(e.target.value))}
          className={inputCls}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-white/60">Loading…</p>
      ) : error ? (
        <p className="text-rose-300">
          {error} — make sure the backend is running (see /backend/README.md).
        </p>
      ) : items.length === 0 ? (
        <p className="text-white/60">No questions yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((q) => (
            <li
              key={q._id}
              className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-black/30 p-3"
            >
              <div className="min-w-0">
                <div className="text-[10px] tracking-[0.25em] text-gold font-display">
                  {roundLabel(q.round)} · {q.category}
                </div>
                <div className="text-white truncate">{q.question}</div>
                <div className="text-xs text-white/60">
                  Answer: <span className="text-emerald-300">{q.correctAnswer}</span>
                </div>
              </div>
              <button
                onClick={() => dispatch(deleteQuestion(q._id))}
                className="shrink-0 p-2 rounded hover:bg-rose-500/20 text-rose-300"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const inputCls =
  "rounded-lg bg-black/40 border border-[color:var(--gold)]/30 px-3 py-2 text-white text-sm focus:outline-none focus:border-[color:var(--cyan)]";
