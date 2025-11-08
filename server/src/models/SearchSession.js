import mongoose from 'mongoose';
const searchSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  query: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  totalIterations: { type: Number, default: 0 },
  finalConfidence: { type: Number, default: 0 },
  improvementDelta: { type: Number, default: 0 },
  bestResults: { type: [String], default: [] },
  agentLogIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentLog' }],
  metrics: {
    latencyMs: { type: Number, default: 0 },
  },
});

export default mongoose.model('SearchSession', searchSessionSchema);
