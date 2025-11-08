import mongoose from 'mongoose';

const searchSessionSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  query: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  totalIterations: { type: Number, default: 0 },
  finalConfidence: { type: Number, default: 0 },
  improvementDelta: { type: Number, default: 0 },
  bestResults: { type: [String], default: [] },
  agentLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AgentLog' }],
});

const SearchSession = mongoose.model('SearchSession', searchSessionSchema);
export default SearchSession;
