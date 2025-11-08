import openai from '../utils/openai.js';
import index from '../utils/pinecone.js';
import { db } from '../config/db.js';
import { builders } from '../config/schema/builders.js';
import { ilike } from 'drizzle-orm';

export async function RetrieverAgent(plan) {
  const requiredSkills = Array.isArray(plan.requiredSkills) ? plan.requiredSkills : [];
  const keywords = Array.isArray(plan.keywords) ? plan.keywords : [];
  const searchTerms = [...requiredSkills, ...keywords].join(' ');

  let locationMatchedIds = null;
  const rawLocation = typeof plan.location === 'string' ? plan.location.trim() : '';

  if (rawLocation.length > 0) {
    const pattern = `%${rawLocation.replace(/\s+/g, ' ')}%`;

    try {
      const rows = await db
        .select({ id: builders.id })
        .from(builders)
        .where(ilike(builders.location, pattern))
        .limit(200);

      if (rows.length > 0) {
        locationMatchedIds = new Set(rows.map((row) => row.id));
      } else {
        console.log(`[RetrieverAgent] No PostgreSQL matches for location "${rawLocation}"`);
      }
    } catch (err) {
      console.error('[RetrieverAgent] Location lookup failed', err);
    }
  }

  const qEmbed = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: searchTerms
  }).then(r => r.data[0].embedding);

  const filter = {};
  if (plan.minExperience) {
    filter.experienceYears = { $gte: plan.minExperience };
  }

  const results = await index.query({
    vector: qEmbed,
    topK: 75,
    includeMetadata: true,
    filter: Object.keys(filter).length > 0 ? filter : undefined
  });

  let matches = results.matches;

  if (locationMatchedIds) {
    matches = matches.filter((m) => locationMatchedIds.has(parseInt(m.id, 10)));
  }

  return matches.map(m => ({
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