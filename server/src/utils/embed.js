// src/utils/embed.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function embedBuilder(profile: any): Promise<number[]> {
  const text = `
${profile.name} - ${profile.headline}
Skills: ${profile.skills.join(", ")}
Traits: ${profile.traits.join(", ")}
Projects: ${profile.projects.map(p => `${p.name}: ${p.description}`).join(" | ")}
Tech: ${profile.projects.flatMap(p => p.techStack).join(", ")}
Prefers: ${profile.preferences.hackathonTypes.join(", ")} hackathons, roles: ${profile.preferences.preferredRoles.join(", ")}
${profile.location} · ${profile.experienceYears} yrs · ${profile.availability}
  `.trim();

  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return res.data[0].embedding;
}