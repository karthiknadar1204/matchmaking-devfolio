import mongoose from 'mongoose';

const metricsSchema = new mongoose.Schema({
  precisionAt5: { type: Number, required: true },
  recallAt10: { type: Number, required: true },
  f1Score: { type: Number, required: true },
}, { _id: false });

const benchmarkSchema = new mongoose.Schema({
  query: { type: String, required: true },
  groundTruth: { type: [String], required: true },
  agentResults: { type: [String], required: true },
  metrics: { type: metricsSchema, required: true },
  evaluatedAt: { type: Date, default: Date.now },
  notes: { type: String },
});

const Benchmark = mongoose.model('Benchmark', benchmarkSchema);
export default Benchmark;
