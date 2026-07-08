import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import questions from "./questionsSlice";
import quiz from "./quizSlice";
import admin from "./adminSlice";
import players from "./playersSlice";

export const store = configureStore({
  reducer: { questions, quiz, admin, players },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
