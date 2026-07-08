import axios from "axios";

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000/api";

export const api = axios.create({ baseURL });

export interface QuestionOption {
  label: string; // a, b, c, d
  text: string;
}

export interface Question {
  _id: string;
  round: string;
  category: string;
  question: string;
  options?: QuestionOption[];
  correctAnswer: string;
  hints?: string[];
  timeLimit?: number;
  createdAt?: string;
}

export type NewQuestion = Omit<Question, "_id" | "createdAt">;

export const QuestionsAPI = {
  list: (params?: { round?: string; category?: string }) =>
    api.get<Question[]>("/questions", { params }).then((r) => r.data),
  create: (q: NewQuestion) => api.post<Question>("/questions", q).then((r) => r.data),
  remove: (id: string) => api.delete(`/questions/${id}`).then((r) => r.data),
  categories: () => api.get<string[]>("/questions/categories").then((r) => r.data),
};
