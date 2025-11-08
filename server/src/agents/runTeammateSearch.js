import { PlannerAgent } from "./planner.js";
import { RetrieverAgent } from "./retriever.js";
import { EvaluatorAgent } from "./evaluator.js";
import { RefinerAgent } from "./refiner.js";
import { RankerAgent } from "./ranker.js";
import { logAgentActivity } from "../utils/logger.js";

export async function runTeammateSearch(query, history = []) {
  let currentPlan = await PlannerAgent(query, history);
  console.log("Plan:", currentPlan);

  let currentResults = [];
  let confidence = 0;
  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  while (confidence < 0.8 && attempts < MAX_ATTEMPTS) {
    attempts++;

    currentResults = await RetrieverAgent(currentPlan);
    console.log(`Retrieved ${currentResults.length} candidates`);

    const evaluation = await EvaluatorAgent(query, currentResults, history);
    confidence = evaluation.confidence;
    console.log("Confidence:", confidence);


    await logAgentActivity({
      query,
      plan: currentPlan,
      retriever: { strategy: 'vector+post', results: currentResults.map(r => r.id) },
      evaluator: { confidence, feedback: evaluation.feedback },
      iterations: attempts,
    });

    let refinedPlan = null;

    if (confidence < 0.8) {
      console.log("Feedback:", evaluation.feedback);
      refinedPlan = await RefinerAgent(query, currentPlan, evaluation.feedback, history);
      currentPlan = refinedPlan;
      console.log("Refined Plan:", currentPlan);
    } else {
      console.log("Success: Confidence ≥ 0.8");
    }

    if (confidence >= 0.8) {
      break;
    }
  }
   const ranked = await RankerAgent(currentResults.slice(0, 10), query);
   console.log("Ranked:", ranked);
   const results = ranked.map(r => r.profile);
   console.log("Results:", results);
  return {
    plan: currentPlan,
    results: results,
    confidence,
    attempts,
    final: confidence >= 0.8 ? "SUCCESS" : "FAILED"
  };
}