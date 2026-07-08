export const ROUND_TYPES = [
  { id: "multiple_choice", label: "Multiple Choice", hint: "Question with 2–6 options; one is correct." },
  { id: "single_answer", label: "Single Answer", hint: "No options shown; players type/say the answer." },
  { id: "impossible_to_google", label: "Impossible to Google", hint: "Answers can't be found online — creative single answer." },
  { id: "speed_round", label: "Speed Round", hint: "Timed multiple choice; set a time limit (seconds)." },
  { id: "cross_reference", label: "Cross Reference", hint: "Question plus a list of hints/clues." },
  { id: "two_truths_one_lie", label: "Two Truths & One Lie", hint: "Three statements; players pick the lie." },
  { id: "reverse_trivia", label: "Reverse Trivia", hint: "Given the answer, players guess the question." },
  { id: "odd_one_out", label: "Odd One Out", hint: "Four items; players pick the one that doesn't belong." },
] as const;

export type RoundId = (typeof ROUND_TYPES)[number]["id"];

export const roundLabel = (id: string) =>
  ROUND_TYPES.find((r) => r.id === id)?.label ?? id;

export const roundsWithOptions: RoundId[] = [
  "multiple_choice",
  "speed_round",
  "two_truths_one_lie",
  "odd_one_out",
];
