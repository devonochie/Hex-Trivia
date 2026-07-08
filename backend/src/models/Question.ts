import { Schema, model, type InferSchemaType } from "mongoose";

export const ROUND_IDS = [
  "multiple_choice",
  "single_answer",
  "impossible_to_google",
  "speed_round",
  "cross_reference",
  "two_truths_one_lie",
  "reverse_trivia",
  "odd_one_out",
] as const;

const OptionSchema = new Schema(
  {
    label: { type: String, required: true, trim: true, lowercase: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const QuestionSchema = new Schema(
  {
    round: { type: String, enum: ROUND_IDS, required: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    question: { type: String, required: true, trim: true },
    options: { type: [OptionSchema], default: undefined },
    correctAnswer: { type: String, required: true, trim: true },
    hints: { type: [String], default: undefined },
    timeLimit: { type: Number, min: 1, max: 600 },
  },
  { timestamps: true },
);

export type QuestionDoc = InferSchemaType<typeof QuestionSchema>;
export const Question = model("Question", QuestionSchema);
