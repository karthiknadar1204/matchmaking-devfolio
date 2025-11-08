import openai from '../utils/openai.js';

export async function EvaluatorAgent(query, candidates, history = []) {
    if (candidates.length === 0) {
        return { confidence: 0, feedback: "No candidates found." };
    }

    const summaries = candidates.slice(0, 8).map(c =>
        `${c.name}: ${c.headline}, ${c.experienceYears}yrs, Skills: ${c.skills?.join(', ')}`
    ).join('\n');

    const context = history.length > 0
        ? `Chat history:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}`
        : '';

    const prompt = `
  ${context}
  Query: "${query}"
  Candidates:
  ${summaries}
  
  Rate confidence (0-1) this covers the user's intent.
  If low, explain why and how to improve.
  JSON:
  { "confidence": number, "feedback": string }
  `;

    const res = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
    });
    return JSON.parse(res.choices[0].message.content);
}