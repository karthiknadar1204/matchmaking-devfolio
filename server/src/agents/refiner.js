import openai from '../config/openai';

export async function RefinerAgent(query, oldPlan, feedback, history = []) {
    const context = history.length > 0
      ? `Chat history:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}`
      : '';
  
    const prompt = `
  ${context}
  Query: "${query}"
  Old Plan: ${JSON.stringify(oldPlan)}
  Feedback: "${feedback}"
  Improve the search plan. JSON only.
  `;
  
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    return JSON.parse(res.choices[0].message.content);
  }