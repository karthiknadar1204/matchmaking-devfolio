
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import '../config/mongoClient.js';
import AgentLog from '../models/AgentLog.js';
import SearchSession from '../models/SearchSession.js';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

console.log('[log-worker] Starting agent log worker...');

const worker = new Worker('agent-log', async (job) => {
  console.log(`[log-worker] Processing job ${job.id} (attempt ${job.attemptsMade + 1})`);
  const logData = job.data;
  const { sessionId, ...rest } = logData;

  try {
    const logRecord = await AgentLog.create({ ...rest, sessionId });

    if (sessionId) {
      await SearchSession.findOneAndUpdate(
        { sessionId },
        {
          $push: { agentLogIds: logRecord._id },
          $setOnInsert: { query: rest.query, startTime: rest.createdAt ?? new Date() },
        },
        { upsert: true }
      );
    }

    console.log(
      `[log-worker] Logged query "${rest.query}" for session ${sessionId ?? 'unknown'} with confidence ${
        rest.finalConfidence ?? 'n/a'
      }`
    );
  } catch (err) {
    console.error('[log-worker] Log failed:', err);
    throw err;
  }
}, { connection });

worker.on('active', (job) => {
  console.log(`[log-worker] Job ${job.id} active`);
});

worker.on('progress', (job, progress) => {
  console.log(`[log-worker] Job ${job.id} progress: ${JSON.stringify(progress)}`);
});

worker.on('failed', (job, err) => {
  console.error(`[log-worker] Job ${job?.id ?? 'unknown'} failed: ${err.message}`);
});

worker.on('completed', (job, result) => {
  console.log(`[log-worker] Job ${job.id} completed`, result ? `result: ${JSON.stringify(result)}` : '');
});

worker.on('error', (err) => {
  console.error('[log-worker] Worker error:', err);
});

worker.on('closed', () => {
  console.log('[log-worker] Worker closed');
});