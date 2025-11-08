
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,  
  enableReadyCheck: false,     
});

export const logQueue = new Queue('agent-log', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 10,
  },
});