// src/agents/evaluator.js
import openai from '../utils/openai.js';

export async function EvaluatorAgent(query, candidates, history = []) {
  if (candidates.length === 0) {
    return { confidence: 0, feedback: "No candidates found." };
  }

  const summaries = candidates.slice(0, 6).map(c =>
    `${c.name}: ${c.headline}, ${c.experienceYears}yrs, Skills: ${c.skills.join(', ')}`
  ).join('\n');

  const prompt = `
User wants: "${query}"

Candidates (max 6):
${summaries}

Rate confidence 0.0–1.0:
- 1.0 = PERFECT match (all skills + experience + location)
- 0.8 = STRONG (missing 1 minor thing)
- 0.6 = OK (missing 1 major thing)
- 0.4 = WEAK (missing multiple)
- 0.0 = NONE

If < 0.8, say why and how to fix.

Return ONLY JSON:
{ "confidence": number, "feedback": string }
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(res.choices[0].message.content);
}