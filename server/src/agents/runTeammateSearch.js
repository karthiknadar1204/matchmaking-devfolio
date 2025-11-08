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
import { PlannerAgent } from "./planner.js";
import { RetrieverAgent } from "./retriever.js";
import { EvaluatorAgent } from "./evaluator.js";
import { RefinerAgent } from "./refiner.js";

export async function runTeammateSearch(query, history = []) {
  const plan = await PlannerAgent(query, history);
  console.log("Plan:", plan);

  const results = await RetrieverAgent(plan);
  console.log(`Retrieved ${results.length} candidates`);

  const evaluation = await EvaluatorAgent(query, results, history);
  console.log("Evaluator:", evaluation);

    if (evaluation.confidence <=0.8 && results.length > 0) {
        const refinedPlan = await RefinerAgent(query, plan, evaluation.feedback, history);
        console.log("Refined Plan:", refinedPlan);
        const refinedResults = await RetrieverAgent(refinedPlan);
        console.log("Refined Results:", refinedResults);
        console.log(`Refined ${refinedResults.length} candidates`);
  }

  return {
    plan,
    results
  };
}