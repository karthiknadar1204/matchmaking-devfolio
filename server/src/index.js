
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import "./config/mongoClient.js";
import { runTeammateSearch } from './agents/runTeammateSearch.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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

    const assistantMessage = result.results.length > 0
      ? `Found ${result.results.length} teammate(s). Top match: ${result.results[0].name}`
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});