import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Trophy, Flag } from "lucide-react";
import { ROUND_TYPES } from "../lib/roundTypes";
import { usePageTitle } from "../lib/usePageTitle";
import { useAppDispatch, useAppSelector } from "../store";
import { endGame } from "../store/playersSlice";
import { fetchQuestions, setFilterRound, setFilterCategory } from "../store/questionsSlice";
import { reset, select, reveal, prev, next } from "../store/quizSlice";
import { QuestionCard } from "./QuestionCard";
import { Scoreboard } from "./Scoreboard";
import { WinnerDialog } from "./WinnerDialog";

export default function Home() {
  usePageTitle("Hexagon Trivia — Play", "Multi-round trivia quiz with 8 game modes.");
  return <PlayerPage />;
}

function PlayerPage() {
  const dispatch = useAppDispatch();
  const { items, filterRound, filterCategory, loading, error } = useAppSelector(
    (s) => s.questions,
  );
  const { currentIndex, selectedLabel, revealed } = useAppSelector((s) => s.quiz);
  const [scoreOpen, setScoreOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchQuestions({
        round: filterRound || undefined,
        category: filterCategory || undefined,
      }),
    );
    dispatch(reset());
  }, [dispatch, filterRound, filterCategory]);

  const current = items[currentIndex];
  const categories = useMemo(
    () => Array.from(new Set(items.map((q) => q.category))).sort(),
    [items],
  );

  return (
    <div className="min-h-screen">
      <TopBar />

      <div className="max-w-6xl mx-auto px-4 pt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
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
        <div className="font-display text-sm text-white/70">
          {items.length > 0
            ? `Question ${Math.min(currentIndex + 1, items.length)} / ${items.length}`
            : ""}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-white/70">Loading questions…</p>
        ) : error ? (
          <div className="max-w-lg mx-auto text-center space-y-3 p-8 rounded-xl border border-rose-400/30 bg-rose-500/10">
            <p className="text-rose-200 font-display">Couldn't reach the backend.</p>
            <p className="text-white/70 text-sm">
              Run the backend: <code className="text-gold">cd backend &amp;&amp; npm i &amp;&amp; npm run dev</code>.
              See <code>backend/README.md</code>.
            </p>
          </div>
        ) : !current ? (
          <div className="text-center space-y-3 py-16">
            <p className="text-white/70">No questions yet.</p>
            <Link
              to="/admin"
              className="inline-block px-5 h-10 leading-10 rounded-lg bg-gold text-purple-deep font-display font-bold glow-gold"
            >
              Go to Admin
            </Link>
          </div>
        ) : (
          <>
            <QuestionCard
              question={current}
              selectedLabel={selectedLabel}
              revealed={revealed}
              onSelect={(l) => dispatch(select(l))}
              onTimeUp={() => dispatch(reveal())}
            />
            <div className="max-w-6xl mx-auto mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => dispatch(prev())}
                disabled={currentIndex === 0}
                className={btnGhost}
              >
                ← Previous
              </button>
              <button onClick={() => dispatch(reveal())} className={btnPrimary}>
                Reveal Answer
              </button>
              <button
                onClick={() => dispatch(next())}
                disabled={currentIndex >= items.length - 1}
                className={btnGhost}
              >
                Next →
              </button>
              <button
                onClick={() => setScoreOpen(true)}
                className={btnGhost + " flex items-center gap-2"}
              >
                <Trophy className="w-4 h-4" /> Scoreboard
              </button>
              <button
                onClick={() => dispatch(endGame())}
                className="px-5 h-11 rounded-lg bg-linear-to-r from-rose-500 to-orange-500 text-white font-display font-bold tracking-wider flex items-center gap-2 shadow-[0_0_24px_rgba(244,63,94,0.5)]"
              >
                <Flag className="w-4 h-4" /> End Game
              </button>
            </div>
          </>
        )}
      </main>
      <Scoreboard open={scoreOpen} onOpenChange={setScoreOpen} />
      <WinnerDialog />
    </div>
  );
}

function TopBar() {
  return (
    <header className="max-w-6xl mx-auto px-4 pt-6 flex items-center justify-between">
      <div>
        <h1 className="font-display font-black text-2xl md:text-3xl tracking-[0.2em] text-gold">
          HEXAGON<span className="text-white">·TRIVIA</span>
        </h1>
        <p className="text-white/60 text-xs tracking-widest">8 ROUNDS · QUIZMASTER MODE</p>
      </div>
      <Link
        to="/admin"
        className="text-sm font-display tracking-widest text-gold border border-(--gold)/40 rounded-md px-3 py-1.5 hover:bg-(--gold)/10"
      >
        ADMIN
      </Link>
    </header>
  );
}

const inputCls =
  "rounded-lg bg-black/40 border border-[color:var(--gold)]/30 px-3 py-2 text-white text-sm focus:outline-none focus:border-[color:var(--cyan)]";
const btnPrimary =
  "px-5 h-11 rounded-lg bg-[color:var(--gold)] text-[color:var(--purple-deep)] font-display font-bold tracking-wider glow-gold";
const btnGhost =
  "px-5 h-11 rounded-lg border border-[color:var(--gold)]/40 text-[color:var(--gold)] font-display tracking-wider hover:bg-[color:var(--gold)]/10 disabled:opacity-40";
