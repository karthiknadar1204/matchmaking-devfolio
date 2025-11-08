import openai from '../utils/openai.js';

export async function RankerAgent(candidates, query) {
    if (candidates.length === 0) return [];
  
    const prompt = `
  Query: "${query}"
  Rank these candidates and explain. Respond ONLY with a JSON array like:
  [
    { "id": number, "score": number, "explanation": string }
  ]
  ${candidates.map(c => `${c.id}: ${c.name} - ${c.headline}`).join('\n')}
  `;
  
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
    });
  
    const rankings = JSON.parse(res.choices[0].message.content);
  const rankingArray = Array.isArray(rankings) ? rankings : rankings.rankings;

  if (!Array.isArray(rankingArray)) {
    console.warn('RankerAgent received non-array response:', rankings);
    return candidates.map((candidate, index) => ({
      id: candidate.id,
      score: 1 - index * 0.1,
      explanation: 'Ranking fallback due to unexpected response format.',
      profile: candidate,
    }));
  }

  return rankingArray.map(r => ({
      ...r,
      profile: candidates.find(c => c.id === r.id)
    }));
  }