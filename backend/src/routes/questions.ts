import { Router } from "express";
import { Question, ROUND_IDS } from "../models/Question.js";

export const questionsRouter = Router();

questionsRouter.get("/categories", async (_req, res) => {
  const cats = await Question.distinct("category");
  res.json(cats.sort());
});

questionsRouter.get("/", async (req, res) => {
  const filter: Record<string, unknown> = {};
  if (typeof req.query.round === "string" && req.query.round) filter.round = req.query.round;
  if (typeof req.query.category === "string" && req.query.category)
    filter.category = req.query.category;
  const items = await Question.find(filter).sort({ createdAt: -1 }).lean();
  res.json(items);
});

questionsRouter.post("/", async (req, res) => {
  try {
    const body = req.body ?? {};
    if (!ROUND_IDS.includes(body.round)) {
      return res.status(400).json({ error: "Invalid round" });
    }
    if (!body.question || !body.category || !body.correctAnswer) {
      return res.status(400).json({ error: "question, category, correctAnswer required" });
    }
    const doc = await Question.create({
      round: body.round,
      category: body.category,
      question: body.question,
      options: Array.isArray(body.options) && body.options.length ? body.options : undefined,
      correctAnswer: body.correctAnswer,
      hints: Array.isArray(body.hints) && body.hints.length ? body.hints : undefined,
      timeLimit: typeof body.timeLimit === "number" ? body.timeLimit : undefined,
    });
    res.status(201).json(doc);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create";
    res.status(500).json({ error: message });
  }
});

questionsRouter.delete("/:id", async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});
