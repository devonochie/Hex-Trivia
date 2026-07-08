import { Link } from "react-router-dom";
import { usePageTitle } from "../lib/usePageTitle";
import { useAppDispatch } from "../store";
import { setAuthed } from "../store/adminSlice";
import { AdminGate } from "./admin/AdminGate";
import { AdminQuestionForm } from "./admin/AdminQuestionForm";
import { QuestionList } from "./admin/QuestionList";

export default function Admin() {
  usePageTitle("Admin — Hexagon Trivia", "Load and manage quiz questions.");

  return (
    <AdminGate>
      <AdminPage />
    </AdminGate>
  );
}

function AdminPage() {
  const dispatch = useAppDispatch();
  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto px-4 pt-6 flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-[0.2em] text-gold">
            ADMIN<span className="text-white">·CONSOLE</span>
          </h1>
          <p className="text-white/60 text-xs tracking-widest">Add questions to any round</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/"
            className="text-sm font-display tracking-widest text-white/80 border border-white/20 rounded-md px-3 py-1.5 hover:bg-white/5"
          >
            ← PLAY
          </Link>
          <button
            onClick={() => dispatch(setAuthed(false))}
            className="text-sm font-display tracking-widest text-rose-300 border border-rose-300/40 rounded-md px-3 py-1.5 hover:bg-rose-300/10"
          >
            LOCK
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8">
        <section>
          <h2 className="font-display text-lg text-gold tracking-widest mb-3">
            NEW QUESTION
          </h2>
          <AdminQuestionForm />
        </section>
        <section>
          <h2 className="font-display text-lg text-gold tracking-widest mb-3">
            LIBRARY
          </h2>
          <QuestionList />
        </section>
      </main>
    </div>
  );
}
