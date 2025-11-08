// import { PlannerAgent } from "./planner.js";
// import { RetrieverAgent } from "./retriever.js";

// export async function runTeammateSearch(query, messages) {
//     const history = messages.slice(0, -1);
//     console.log(query, history);
  
//     const plan = await PlannerAgent(query, history);
//     console.log("plan", plan);
//     let results = await RetrieverAgent(plan);
//     console.log("results", results);
//     // const eval = await EvaluatorAgent(userQuery, results, history);
  
//     // if (eval.confidence < 0.7 && results.length > 0) {
//     //   const refinedPlan = await RefinerAgent(userQuery, plan, eval.feedback, history);
//     //   results = await RetrieverAgent(refinedPlan);
//     // }
  
//     // const ranked = await RankerAgent(results.slice(0, 10), userQuery);
  
//     return {
//       plan,
//       // evaluation: eval,
//       // results: ranked
//     };
//   }

// agents/runTeammateSearch.js
// agents/runTeammateSearch.js
import { PlannerAgent } from "./planner.js";
import { RetrieverAgent } from "./retriever.js";
import { EvaluatorAgent } from "./evaluator.js";
import { RefinerAgent } from "./refiner.js";

export async function runTeammateSearch(query, history = []) {
  let currentPlan = await PlannerAgent(query, history);
  console.log("Plan:", currentPlan);

  let currentResults = [];
  let confidence = 0;
  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  while (confidence < 0.8 && attempts < MAX_ATTEMPTS) {
    attempts++;
    console.log(`\n--- Attempt ${attempts} ---`);

    // 1. RETRIEVE FIRST
    currentResults = await RetrieverAgent(currentPlan);
    console.log(`Retrieved ${currentResults.length} candidates`);

    // 2. EVALUATE
    const evaluation = await EvaluatorAgent(query, currentResults, history);
    confidence = evaluation.confidence;
    console.log("Confidence:", confidence);

    if (confidence >= 0.8) {
      console.log("Success: Confidence ≥ 0.8");
      break;
    }

    console.log("Feedback:", evaluation.feedback);

    // 3. REFINE
    currentPlan = await RefinerAgent(query, currentPlan, evaluation.feedback, history);
    console.log("Refined Plan:", currentPlan);
  }

  return {
    plan: currentPlan,
    results: currentResults,
    confidence,
    attempts,
    final: confidence >= 0.8 ? "SUCCESS" : "FAILED"
  };
}