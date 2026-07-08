import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy, Medal, Award, Sparkles, Plus, RotateCcw, Check, Pencil, Minus, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useAppDispatch, useAppSelector } from "../store";
import { addPlayer, renamePlayer, resetScores, setScore, decrementScore, incrementScore, removePlayer } from "../store/playersSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";


interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const MEDAL_STYLES = [
  { grad: "from-yellow-300 via-amber-400 to-yellow-600", ring: "ring-yellow-300/60", label: "1ST", icon: Trophy },
  { grad: "from-slate-200 via-slate-300 to-slate-500", ring: "ring-slate-200/50", label: "2ND", icon: Medal },
  { grad: "from-amber-500 via-orange-600 to-amber-800", ring: "ring-amber-500/50", label: "3RD", icon: Award },
];

export function Scoreboard({ open, onOpenChange }: Props) {
  const dispatch = useAppDispatch();
  const players = useAppSelector((s) => s.players.items);
  const lastScored = useAppSelector((s) => s.players.lastScored);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const ranked = useMemo(
    () => [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
    [players],
  );

  const handleAdd = () => {
    if (!name.trim()) return;
    dispatch(addPlayer(name));
    setName("");
  };

  const startEdit = (id: string, current: string) => {
    setEditingId(id);
    setEditName(current);
  };
  const commitEdit = () => {
    if (editingId && editName.trim()) {
      dispatch(renamePlayer({ id: editingId, name: editName.trim() }));
    }
    setEditingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-(--gold)/40 bg-[radial-gradient(ellipse_at_top,#3a0f6a,#180530)] text-white">
        <DialogHeader>
          <DialogTitle className="font-display tracking-[0.25em] text-gold flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> SCOREBOARD
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add player name…"
            className="flex-1 rounded-lg bg-black/40 border border-(--gold)/30 px-3 py-2 text-sm focus:outline-none focus:border-cyan"
          />
          <button
            onClick={handleAdd}
            className="px-4 rounded-lg bg-gold text-purple-deep font-display font-bold flex items-center gap-1 hover:brightness-110"
          >
            <Plus className="w-4 h-4" /> ADD
          </button>
          <button
            onClick={() => dispatch(resetScores())}
            title="Reset all scores"
            className="px-3 rounded-lg border border-white/20 text-white/80 hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] tracking-widest text-white/40 mt-1">
          PLAYERS PERSIST FOR 2 HOURS ON THIS DEVICE
        </p>

        <div className="mt-2 max-h-[60vh] overflow-y-auto pr-1">
          {ranked.length === 0 ? (
            <p className="text-center text-white/50 py-10 italic">
              No players yet. Add someone to start scoring.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-black/50 text-[10px] tracking-[0.25em] text-gold">
                  <tr>
                    <th className="text-left px-3 py-2 w-16">RANK</th>
                    <th className="text-left px-3 py-2">PLAYER</th>
                    <th className="text-center px-3 py-2 w-24">SCORE</th>
                    <th className="text-right px-3 py-2 w-56">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {ranked.map((p, i) => {
                      const medal = i < 3 ? MEDAL_STYLES[i] : null;
                      const Icon = medal?.icon;
                      const isLast = lastScored === p.id;
                      const isEditing = editingId === p.id;
                      return (
                        <motion.tr
                          key={p.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className={cn(
                            "border-t border-white/5 bg-black/20",
                            isLast && "bg-(--cyan)/10",
                          )}
                        >
                          <td className="px-3 py-2">
                            <div className={cn(
                              "grid place-items-center w-9 h-9 rounded-full font-display font-black text-xs",
                              medal
                                ? `bg-linear-to-br ${medal.grad} text-purple-deep`
                                : "bg-white/10 text-white/70"
                            )}>
                              {Icon ? <Icon className="w-4 h-4" /> : `#${i + 1}`}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            {isEditing ? (
                              <div className="flex gap-1">
                                <input
                                  autoFocus
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") commitEdit();
                                    if (e.key === "Escape") setEditingId(null);
                                  }}
                                  className="flex-1 rounded bg-black/50 border border-(--cyan)/50 px-2 py-1 text-sm focus:outline-none"
                                />
                                <button
                                  onClick={commitEdit}
                                  className="p-1.5 rounded bg-cyan text-purple-deep"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 group">
                                <span className="font-display font-bold truncate">{p.name}</span>
                                {medal && (
                                  <span className="text-[9px] tracking-[0.25em] text-gold">
                                    {medal.label}
                                  </span>
                                )}
                                <button
                                  onClick={() => startEdit(p.id, p.name)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-white/60 hover:text-white"
                                  title="Rename"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <motion.input
                              key={p.score}
                              initial={{ scale: 1.3, color: "#4ee0ff" }}
                              animate={{ scale: 1, color: "#ffffff" }}
                              transition={{ duration: 0.3 }}
                              type="number"
                              min={0}
                              value={p.score}
                              onChange={(e) => dispatch(setScore({ id: p.id, score: Number(e.target.value) }))}
                              className="w-16 rounded bg-black/50 border border-white/10 px-2 py-1 text-center font-display font-black text-lg tabular-nums focus:outline-none focus:border-cyan"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => dispatch(decrementScore(p.id))}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-200 font-display font-bold text-xs hover:bg-rose-500/30 flex items-center gap-1"
                                title="Subtract 2"
                              >
                                <Minus className="w-3 h-3" /> 2
                              </button>
                              <button
                                onClick={() => dispatch(incrementScore(p.id))}
                                className="px-2.5 py-1.5 rounded-lg bg-cyan text-purple-deep font-display font-bold text-xs hover:brightness-110 flex items-center gap-1 shadow-[0_0_14px_rgba(78,224,255,0.5)]"
                                title="Add 2"
                              >
                                <Plus className="w-3 h-3" /> 2
                              </button>
                              <button
                                onClick={() => dispatch(removePlayer(p.id))}
                                className="p-1.5 rounded-lg text-rose-300/70 hover:bg-rose-400/10"
                                title="Remove player"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
