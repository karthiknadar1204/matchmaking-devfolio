// utils/logger.js
import { logQueue } from '../queues/logQueue.js';

export async function logAgentActivity(data) {
  const logData = {
    query: data.query || 'unknown',
    plan: {
      text: JSON.stringify(data.plan || {}), // ← REQUIRED
      structured: data.plan || {}
    },
    retriever: {
      strategy: data.retriever?.strategy || 'vector',
      results: data.retriever?.results || [],
      metadata: data.retriever?.metadata || {}
    },
    evaluator: {
      confidence: data.evaluator?.confidence ?? 0,
      feedback: data.evaluator?.feedback || 'No feedback', // ← REQUIRED
      explanations: data.evaluator?.explanations || {}
    },
    refiner: data.refiner || null,
    ranker: data.ranker || null,
    metrics: data.metrics || null,
    iterations: data.iterations || 1,
    finalConfidence: data.finalConfidence || 0
  };

  await logQueue.add('log', logData, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  });
}