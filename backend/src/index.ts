import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { questionsRouter } from "./routes/questions.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/hexagon_trivia";
const CORS_ORIGIN = (process.env.CORS_ORIGIN ?? "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: CORS_ORIGIN.includes("*") ? true : CORS_ORIGIN,
    credentials: false,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/questions", questionsRouter);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`));
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
