import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Player {
  id: string;
  name: string;
  score: number;
}

interface PlayersState {
  items: Player[];
  gameEnded: boolean;
  lastScored?: string | null;
}

const STORAGE_KEY = "hex-trivia-players";
const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

interface Envelope {
  savedAt: number;
  items: Player[];
}

function load(): Player[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Back-compat: legacy value was a bare array.
    if (Array.isArray(parsed)) {
      persist(parsed);
      return parsed;
    }
    const env = parsed as Envelope;
    if (!env || typeof env.savedAt !== "number" || !Array.isArray(env.items)) return [];
    if (Date.now() - env.savedAt > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return env.items;
  } catch {
    return [];
  }
}

function persist(items: Player[]) {
  if (typeof window === "undefined") return;
  try {
    const env: Envelope = { savedAt: Date.now(), items };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(env));
  } catch {
    /* ignore */
  }
}

const initialState: PlayersState = {
  items: load(),
  gameEnded: false,
  lastScored: null,
};

const slice = createSlice({
  name: "players",
  initialState,
  reducers: {
    addPlayer: {
      reducer(state, action: PayloadAction<Player>) {
        state.items.push(action.payload);
        persist(state.items);
      },
      prepare(name: string) {
        return {
          payload: {
            id: crypto.randomUUID(),
            name: name.trim(),
            score: 0,
          },
        };
      },
    },
    renamePlayer(state, action: PayloadAction<{ id: string; name: string }>) {
      const p = state.items.find((x) => x.id === action.payload.id);
      if (p) {
        p.name = action.payload.name;
        persist(state.items);
      }
    },
    removePlayer(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      persist(state.items);
    },
    incrementScore(state, action: PayloadAction<string>) {
      const p = state.items.find((x) => x.id === action.payload);
      if (p) {
        p.score += 2;
        state.lastScored = p.id;
        persist(state.items);
      }
    },
    decrementScore(state, action: PayloadAction<string>) {
      const p = state.items.find((x) => x.id === action.payload);
      if (p) {
        p.score = Math.max(0, p.score - 2);
        state.lastScored = p.id;
        persist(state.items);
      }
    },
    setScore(state, action: PayloadAction<{ id: string; score: number }>) {
      const p = state.items.find((x) => x.id === action.payload.id);
      if (p) {
        p.score = Math.max(0, Math.floor(action.payload.score) || 0);
        state.lastScored = p.id;
        persist(state.items);
      }
    },
    resetScores(state) {
      state.items.forEach((p) => (p.score = 0));
      state.gameEnded = false;
      state.lastScored = null;
      persist(state.items);
    },
    endGame(state) {
      state.gameEnded = true;
    },
    dismissGameEnded(state) {
      state.gameEnded = false;
    },
    clearLastScored(state) {
      state.lastScored = null;
    },
  },
});

export const {
  addPlayer,
  renamePlayer,
  removePlayer,
  incrementScore,
  decrementScore,
  setScore,
  resetScores,
  endGame,
  dismissGameEnded,
  clearLastScored,
} = slice.actions;
export default slice.reducer;
