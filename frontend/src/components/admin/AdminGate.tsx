import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store";
import { setAuthed } from "../../store/adminSlice";

// Simple client-side passcode gate. Change via VITE_ADMIN_PASSCODE env var.
const PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE as string | undefined

export function AdminGate({ children }: { children: React.ReactNode }) {
  const authed = useAppSelector((s) => s.admin.authed);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value === PASSCODE) dispatch(setAuthed(true));
          else setError("Wrong passcode");
        }}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-(--gold)/40 bg-black/40 p-8"
      >
        <h1 className="font-display font-black text-2xl text-gold tracking-widest text-center">
          ADMIN
        </h1>
        <p className="text-center text-white/70 text-sm">Enter the passcode to load questions.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          placeholder="Passcode"
          className="w-full rounded-lg bg-black/40 border border-(--gold)/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-cyan"
        />
        {error ? <p className="text-rose-300 text-sm">{error}</p> : null}
        <button
          type="submit"
          className="w-full h-11 rounded-lg bg-gold text-purple-deep font-display font-bold tracking-wider glow-gold"
        >
          Enter
        </button>
        <p className="text-[10px] text-white/40 text-center">
          Default: <code>quizmaster</code> — override with VITE_ADMIN_PASSCODE
        </p>
      </form>
    </div>
  );
}
