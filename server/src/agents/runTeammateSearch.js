import { randomUUID } from "crypto";
import { PlannerAgent } from "./planner.js";
import { RetrieverAgent } from "./retriever.js";
import { EvaluatorAgent } from "./evaluator.js";
import { RefinerAgent } from "./refiner.js";
import { RankerAgent } from "./ranker.js";
import { logAgentActivity } from "../utils/logger.js";
import SearchSession from "../models/SearchSession.js";

export async function runTeammateSearch(query, history = []) {
  const sessionId = randomUUID();
  await SearchSession.create({
    sessionId,
    query,
    startTime: new Date(),
  });

  const searchStart = Date.now();
  let currentPlan = await PlannerAgent(query, history);
  console.log("Plan:", currentPlan);

  let currentResults = [];
  let confidence = 0;
  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  while (confidence < 0.8 && attempts < MAX_ATTEMPTS) {
    const iterationStart = Date.now();
    attempts++;

    currentResults = await RetrieverAgent(currentPlan);
    console.log(`Retrieved ${currentResults.length} candidates`);

    const evaluation = await EvaluatorAgent(query, currentResults, history);
    confidence = evaluation.confidence;
    console.log("Confidence:", confidence);


    let refinedPlan = null;

    if (confidence < 0.8) {
      console.log("Feedback:", evaluation.feedback);
      refinedPlan = await RefinerAgent(query, currentPlan, evaluation.feedback, history);
      currentPlan = refinedPlan;
      console.log("Refined Plan:", currentPlan);
    } else {
      console.log("Success: Confidence ≥ 0.8");
    }

    const planSnapshot = {
      text: JSON.stringify(currentPlan),
      structured: currentPlan,
    };

    const latencyMs = Date.now() - iterationStart;

    await logAgentActivity({
      query,
      sessionId,
      plan: planSnapshot,
      retriever: { strategy: "vector+post", results: currentResults.map((r) => r.id) },
      evaluator: { confidence, feedback: evaluation.feedback },
      refiner: refinedPlan
        ? {
            refinementReason: evaluation.feedback,
            newPlan: refinedPlan,
          }
        : null,
      metrics: { latencyMs },
      finalConfidence: confidence,
      iterations: attempts,
    });

    if (confidence >= 0.8) {
      break;
    }
  }
  const ranked = await RankerAgent(currentResults.slice(0, 10), query);
  console.log("Ranked:", ranked);
  const results = ranked.map(r => r.profile);
  console.log("Results:", results);
  const totalLatency = Date.now() - searchStart;

  await logAgentActivity({
    query,
    sessionId,
    plan: {
      text: JSON.stringify(currentPlan),
      structured: currentPlan,
    },
    retriever: { strategy: "vector+post", results: currentResults.map((r) => r.id) },
    evaluator: { confidence, feedback: "Final ranking completed" },
    refiner: null,
    ranker: {
      rankedResults: ranked
        .map((item) => item.profile?.id ?? item.profile?._id ?? null)
        .filter(Boolean),
      relevanceScores: ranked.reduce((acc, item) => {
        const id = item.profile?.id ?? item.profile?._id;
        if (id) {
          acc[id] = item.totalScore ?? item.matchScore ?? item.vectorScore ?? null;
        }
        return acc;
      }, {}),
    },
    metrics: { latencyMs: totalLatency },
    finalConfidence: confidence,
    iterations: attempts,
  });

  await SearchSession.findOneAndUpdate(
    { sessionId },
    {
      endTime: new Date(),
      totalIterations: attempts,
      finalConfidence: confidence,
      improvementDelta: confidence,
      bestResults: results.map((r) => r?.id ?? r?._id ?? null).filter(Boolean),
      metrics: { latencyMs: totalLatency },
    }
  );

  return {
    sessionId,
    plan: currentPlan,
    results: results,
    confidence,
    attempts,
    final: confidence >= 0.8 ? "SUCCESS" : "FAILED"
  };
}