import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const KEY = "quiz_admin_authed";

interface AdminState {
  authed: boolean;
}

const initialState: AdminState = {
  authed: typeof window !== "undefined" && window.sessionStorage.getItem(KEY) === "1",
};

const slice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAuthed(s, a: PayloadAction<boolean>) {
      s.authed = a.payload;
      if (typeof window !== "undefined") {
        if (a.payload) window.sessionStorage.setItem(KEY, "1");
        else window.sessionStorage.removeItem(KEY);
      }
    },
  },
});

export const { setAuthed } = slice.actions;
export default slice.reducer;
