import openai from '../utils/openai.js';

export async function PlannerAgent(query, history = []) {
    const context = history.length > 0
      ? `Previous messages:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}`
      : '';
  
    const prompt = `
  ${context}
  User: "${query}"
  
  You are a hackathon teammate matchmaker. Parse this into a JSON search plan.
  Respond ONLY in JSON with this exact structure:
  {
    "keywords": string[],
    "requiredSkills": string[],
    "hackathonTypes": string[],
    "minExperience": number | null,
    "availability": string | null,
    "location": string | null
  }
  Use null when availability, location, or experience are not specified.
  `;
  
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
  
    return JSON.parse(res.choices[0].message.content);
  }