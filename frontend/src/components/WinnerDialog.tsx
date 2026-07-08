import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Medal, Award, PartyPopper } from "lucide-react";
import { cn } from "../lib/utils";
import { useAppDispatch, useAppSelector } from "../store";
import { dismissGameEnded, resetScores } from "../store/playersSlice";
import  { Dialog, DialogContent } from "./ui/dialog";

const PODIUM = [
  { grad: "from-yellow-300 via-amber-400 to-yellow-600", glow: "shadow-[0_0_60px_rgba(250,204,21,0.7)]", icon: Trophy, label: "CHAMPION", h: "h-52" },
  { grad: "from-slate-200 via-slate-300 to-slate-500", glow: "shadow-[0_0_40px_rgba(203,213,225,0.55)]", icon: Medal, label: "SILVER", h: "h-40" },
  { grad: "from-amber-500 via-orange-600 to-amber-800", glow: "shadow-[0_0_40px_rgba(217,119,6,0.55)]", icon: Award, label: "BRONZE", h: "h-32" },
];

export function WinnerDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.players.gameEnded);
  const players = useAppSelector((s) => s.players.items);

  const ranked = useMemo(
    () => [...players].sort((a, b) => b.score - a.score).slice(0, 3),
    [players],
  );

  useEffect(() => {
    if (!open) return;
    // Confetti burst sequence
    const end = Date.now() + 2500;
    const colors = ["#f0b91a", "#4ee0ff", "#ff5edb", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 }, colors });
  }, [open]);

  const winner = ranked[0];

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Dialog open={open} onOpenChange={(v: any) => !v && dispatch(dismissGameEnded())}>
      <DialogContent className="max-w-3xl border-(--gold)/60 bg-[radial-gradient(ellipse_at_center,#4a1580,#180530)] text-white overflow-hidden">
        {/* Glitter background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-gold"
              initial={{ opacity: 0, y: Math.random() * 400, x: Math.random() * 600 }}
              animate={{
                opacity: [0, 1, 0],
                y: [Math.random() * 400, Math.random() * 400 - 60],
              }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center pt-2">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="inline-flex items-center gap-2 font-display tracking-[0.3em] text-gold text-sm"
          >
            <PartyPopper className="w-4 h-4" /> GAME OVER <PartyPopper className="w-4 h-4" />
          </motion.div>

          {winner ? (
            <>
              <motion.h2
                initial={{ opacity: 0, scale: 0.6, rotateX: -60 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
                style={{ textShadow: "0 4px 0 rgba(0,0,0,0.5), 0 0 30px rgba(240,185,26,0.7)" }}
                className="mt-3 font-display font-black text-5xl md:text-7xl bg-linear-to-b from-yellow-200 via-amber-400 to-orange-600 bg-clip-text text-transparent"
              >
                {winner.name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 font-display tracking-widest mt-1"
              >
                WINS WITH <span className="text-cyan text-2xl font-black">{winner.score}</span> POINTS
              </motion.p>
            </>
          ) : (
            <p className="mt-6 text-white/60">No players scored. Add some players next round!</p>
          )}

          {/* Podium */}
          {ranked.length > 0 && (
            <div className="mt-8 flex items-end justify-center gap-4 md:gap-6">
              {[1, 0, 2].map((rankIdx) => {
                const p = ranked[rankIdx];
                if (!p) return <div key={rankIdx} className="w-24" />;
                const meta = PODIUM[rankIdx];
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + rankIdx * 0.2, type: "spring", stiffness: 160 }}
                    className="flex flex-col items-center w-24 md:w-32"
                  >
                    <Icon className={cn(
                      "w-8 h-8 mb-2",
                      rankIdx === 0 ? "text-yellow-300" : rankIdx === 1 ? "text-slate-200" : "text-amber-500"
                    )} />
                    <div className="font-display font-bold text-sm md:text-base truncate max-w-full">
                      {p.name}
                    </div>
                    <div className="font-display font-black text-2xl">{p.score}</div>
                    <div className={cn(
                      "mt-2 w-full rounded-t-lg bg-linear-to-b flex items-start justify-center pt-2 font-display font-black text-purple-deep",
                      meta.grad, meta.h, meta.glow
                    )}>
                      {meta.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => { dispatch(resetScores()); dispatch(dismissGameEnded()); }}
              className="px-5 h-11 rounded-lg bg-gold text-purple-deep font-display font-bold tracking-wider"
            >
              NEW GAME
            </button>
            <button
              onClick={() => dispatch(dismissGameEnded())}
              className="px-5 h-11 rounded-lg border border-white/30 font-display tracking-wider hover:bg-white/10"
            >
              CLOSE
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
