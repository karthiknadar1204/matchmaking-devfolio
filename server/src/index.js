
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import "./config/mongoClient.js";
import { runTeammateSearch } from './agents/runTeammateSearch.js';
import AgentLog from './models/AgentLog.js';
import SearchSession from './models/SearchSession.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(origin => origin.trim()).filter(Boolean)
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

const conversationHistory = [
  { role: 'system', content: 'You are a helpful hackathon teammate finder.' }
];

app.get('/', (req, res) => {
  res.json({ message: 'Teammate Search API — POST /ask to chat' });
});

app.post('/ask', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Send { "query": "your message" }' });
  }

  try {
    conversationHistory.push({ role: 'user', content: query });

    if (conversationHistory.length > 10) {
      conversationHistory.splice(1, conversationHistory.length - 10);
    }

    console.log(`\nUser: ${query}`);
    console.log(`History length: ${conversationHistory.length}`);



    const result = await runTeammateSearch(query, conversationHistory.slice(0, -1));

    const topMatch = result.results[0];
    const assistantMessage = result.results.length > 0
      ? `Found ${result.results.length} teammate(s). Top match: ${topMatch.name} (${topMatch.location || 'location unknown'})`
      : "No teammates found. Try refining your query.";

    conversationHistory.push({ role: 'assistant', content: assistantMessage });

    res.json({
      reply: assistantMessage,
      plan: result.plan,
      results: result.results.map(r => ({
        id: r.id,
        name: r.name,
        headline: r.headline,
        location: r.location,
        experienceYears: r.experienceYears,
        availability: r.availability,
        skills: r.skills,
        github: r.github,
        linkedin: r.linkedin,
        vectorScore: typeof r.vectorScore === 'number' ? r.vectorScore.toFixed(3) : null,
        matchScore: r.matchScore,
        totalScore: typeof r.totalScore === 'number' ? r.totalScore.toFixed(3) : null
      }))
    });
  } catch (error) {
    console.error('Search failed:', error);
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

app.get('/logs', async (req, res) => {
  const limitParam = parseInt(req.query.limit, 10);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 25;

  try {
    const [agentLogs, searchSessions] = await Promise.all([
      AgentLog.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      SearchSession.find({})
        .sort({ startTime: -1 })
        .limit(limit)
        .lean(),
    ]);

    res.json({
      agentLogs,
      searchSessions,
    });
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});