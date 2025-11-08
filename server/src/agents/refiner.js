import openai from '../utils/openai.js';

export async function RefinerAgent(query, oldPlan, feedback, history = []) {
  const context = history.length > 0
    ? `Chat history:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}`
    : '';

  const prompt = `
${context}
Query: "${query}"
Old Plan: ${JSON.stringify(oldPlan)}
Feedback: "${feedback}"

Improve the plan. ONLY use these fields:
- keywords: string[]
- requiredSkills: string[]
- minExperience: number | null
- location: string | null
- availability: string | null

Do not add new fields. Only modify these.

Respond ONLY in JSON.
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const refined = JSON.parse(res.choices[0].message.content);


  return {
    keywords: Array.isArray(refined.keywords) ? refined.keywords : oldPlan.keywords || [],
    requiredSkills: Array.isArray(refined.requiredSkills) ? refined.requiredSkills : oldPlan.requiredSkills || [],
    minExperience: typeof refined.minExperience === 'number' ? refined.minExperience : oldPlan.minExperience,
    location: typeof refined.location === 'string' ? refined.location : oldPlan.location,
    availability: typeof refined.availability === 'string' ? refined.availability : oldPlan.availability
  };
}