
import openai from '../utils/openai.js';
import index from '../utils/pinecone.js';

export async function RetrieverAgent(plan) {
  const searchTerms = [...plan.requiredSkills, ...plan.keywords].join(' ');

  const qEmbed = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: searchTerms
  }).then(r => r.data[0].embedding);


  const filter = {};
  if (plan.minExperience) filter.experienceYears = { $gte: plan.minExperience };

  console.log("filter", filter);

  const results = await index.query({
    vector: qEmbed,
    topK: 5,
    includeMetadata: true,
    filter: Object.keys(filter).length > 0 ? filter : undefined
  });

  console.log("results", results);
  return results.matches.map(m => ({
    id: parseInt(m.id),
    name: m.metadata.name,
    headline: m.metadata.headline,
    location: m.metadata.location,
    experienceYears: m.metadata.experienceYears,
    availability: m.metadata.availability,
    skills: m.metadata.skills || [],
    techStack: m.metadata.techStack || [],
    vectorScore: m.score
  }));
}