import openai from '../utils/openai.js';
export async function EvaluatorAgent(query, candidates, history = [], plan = {}) {

  if (plan.requiredSkills?.length > 0) {
    candidates = candidates.filter(c => 
      plan.requiredSkills.every(req => 
        c.skills.some(s => s.toLowerCase().includes(req.toLowerCase()))
      )
    );
  }

  if (candidates.length === 0) {
    return { confidence: 0, feedback: "No candidates found." };
  }

  const summaries = candidates.slice(0, 6).map(c =>
    `${c.name}: ${c.headline}, ${c.experienceYears}yrs, Location: ${c.location}, Skills: ${c.skills.join(', ')}`
  ).join('\n');

  const prompt = `
User wants: "${query}"

Candidates (max 6):
${summaries}

Rate confidence 0.0–1.0:
- 1.0 = PERFECT
- 0.8 = STRONG
- 0.6 = OK
- 0.4 = WEAK
- 0.0 = NONE

If < 0.8, explain why and how to fix.

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