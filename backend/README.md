# Trivia — Backend

Node.js + TypeScript + Express + Mongoose API for the quiz app.

## Setup

1. Install MongoDB locally OR create a free MongoDB Atlas cluster and copy its connection string.
2. Copy env:
   ```bash
   cp .env.example .env
   # edit MONGODB_URI
   ```
3. Install & run:
   ```bash
   npm install
   npm run dev
   ```
   The API starts on `http://localhost:4000`.

## Frontend config

Set `VITE_API_URL=http://localhost:4000/api` in the frontend's `.env` (defaults to that if omitted).

## Endpoints

- `GET  /api/questions?round=&category=` — list, optionally filtered
- `POST /api/questions` — create a question
- `DELETE /api/questions/:id` — delete
- `GET  /api/questions/categories` — distinct categories
- `GET  /health` — health check

## Question schema

```ts
{
  round: "multiple_choice" | "single_answer" | "impossible_to_google"
       | "speed_round" | "cross_reference" | "two_truths_one_lie"
       | "reverse_trivia" | "odd_one_out",
  category: string,
  question: string,
  options?: [{ label: "a"|"b"|..., text: string }],
  correctAnswer: string,   // option letter for MCQ rounds, else free text
  hints?: string[],
  timeLimit?: number       // seconds, speed_round only
}
```
