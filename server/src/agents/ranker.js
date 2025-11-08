import openai from '../config/openai';

export async function RankerAgent(candidates, query) {
    if (candidates.length === 0) return [];
  
    const prompt = `
  Query: "${query}"
  Rank these candidates and explain. JSON array:
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
    return rankings.map(r => ({
      ...r,
      profile: candidates.find(c => c.id === r.id)
    }));
  }