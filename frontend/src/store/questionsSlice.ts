import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import  { type Question, QuestionsAPI, type NewQuestion } from "../lib/api";


interface QuestionsState {
  items: Question[];
  loading: boolean;
  error: string | null;
  filterRound: string;
  filterCategory: string;
}

const initialState: QuestionsState = {
  items: [],
  loading: false,
  error: null,
  filterRound: "",
  filterCategory: "",
};

export const fetchQuestions = createAsyncThunk(
  "questions/fetch",
  async (params: { round?: string; category?: string } | undefined) =>
    QuestionsAPI.list(params),
);

export const createQuestion = createAsyncThunk(
  "questions/create",
  async (q: NewQuestion) => QuestionsAPI.create(q),
);

export const deleteQuestion = createAsyncThunk(
  "questions/delete",
  async (id: string) => {
    await QuestionsAPI.remove(id);
    return id;
  },
);

const slice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setFilterRound(state, action: PayloadAction<string>) {
      state.filterRound = action.payload;
    },
    setFilterCategory(state, action: PayloadAction<string>) {
      state.filterCategory = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchQuestions.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchQuestions.fulfilled, (s, a) => {
      s.loading = false;
      s.items = a.payload;
    });
    b.addCase(fetchQuestions.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? "Failed to load questions";
    });
    b.addCase(createQuestion.fulfilled, (s, a) => {
      s.items.unshift(a.payload);
    });
    b.addCase(deleteQuestion.fulfilled, (s, a) => {
      s.items = s.items.filter((q) => q._id !== a.payload);
    });
  },
});

export const { setFilterRound, setFilterCategory } = slice.actions;
export default slice.reducer;
