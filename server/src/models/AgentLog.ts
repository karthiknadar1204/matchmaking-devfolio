import mongoose from 'mongoose';

const evaluatorSchema = new mongoose.Schema({
  confidence: { type: Number, required: true },
  feedback: { type: String, required: true },
  explanations: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false });

const refinerSchema = new mongoose.Schema({
  refinementReason: { type: String },
  newPlan: { type: mongoose.Schema.Types.Mixed },
  newResults: { type: [String] },
}, { _id: false });

const planSchema = new mongoose.Schema({
  text: { type: String, required: true },
  structured: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false });

const retrieverSchema = new mongoose.Schema({
  strategy: { type: String },
  results: { type: [String], default: [] },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const rankerSchema = new mongoose.Schema({
  rankedResults: { type: [String], default: [] },
  relevanceScores: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false });

const metricsSchema = new mongoose.Schema({
  precisionAt5: { type: Number, default: 0 },
  recallAt10: { type: Number, default: 0 },
  f1Score: { type: Number, default: 0 },
  latencyMs: { type: Number, default: 0 },
}, { _id: false });

const agentLogSchema = new mongoose.Schema({
  query: { type: String, required: true },
  plan: { type: planSchema, required: true },
  retriever: { type: retrieverSchema, required: true },
  evaluator: { type: evaluatorSchema, required: true },
  refiner: { type: refinerSchema },
  ranker: { type: rankerSchema },
  metrics: { type: metricsSchema },
  iterations: { type: Number, default: 1 },
  finalConfidence: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const AgentLog = mongoose.model('AgentLog', agentLogSchema);
export default AgentLog;
