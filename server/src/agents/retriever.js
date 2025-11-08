// src/agents/retriever.js
import openai from '../utils/openai.js';
import index from '../utils/pinecone.js';

export async function RetrieverAgent(plan) {
  // 1. Embed only keywords + requiredSkills
  const searchTerms = [...plan.requiredSkills, ...plan.keywords].join(' ');

  const qEmbed = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: searchTerms
  }).then(r => r.data[0].embedding);

  // 2. ONLY LIGHT FILTER: Experience
  const filter = {};
  if (plan.minExperience) {
    filter.experienceYears = { $gte: plan.minExperience };
  }

  console.log("filter", filter);

  // 3. BROAD SEARCH
  const results = await index.query({
    vector: qEmbed,
    topK: 50,  // ← WIDE NET
    includeMetadata: true,
    filter: Object.keys(filter).length > 0 ? filter : undefined
  });

  // 4. Return RAW candidates
  return results.matches.map(m => ({
    id: parseInt(m.id),
    name: m.metadata.name,
    headline: m.metadata.headline,
    location: m.metadata.location,
    experienceYears: m.metadata.experienceYears,
    availability: m.metadata.availability,
    skills: m.metadata.skills || [],
    vectorScore: m.score
  }));
}