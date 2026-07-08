import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface QuizState {
  currentIndex: number;
  revealed: boolean;
  selectedLabel: string | null;
}

const initialState: QuizState = { currentIndex: 0, revealed: false, selectedLabel: null };

const slice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    next(s) {
      s.currentIndex += 1;
      s.revealed = false;
      s.selectedLabel = null;
    },
    prev(s) {
      s.currentIndex = Math.max(0, s.currentIndex - 1);
      s.revealed = false;
      s.selectedLabel = null;
    },
    reset(s) {
      s.currentIndex = 0;
      s.revealed = false;
      s.selectedLabel = null;
    },
    select(s, a: PayloadAction<string>) {
      s.selectedLabel = a.payload;
    },
    reveal(s) {
      s.revealed = true;
    },
  },
});

export const { next, prev, reset, select, reveal } = slice.actions;
export default slice.reducer;
