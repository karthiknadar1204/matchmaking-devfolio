
import { db } from '../config/db.js';
import openai from '../utils/openai.js';
import index from '../utils/pinecone.js';
import {
  builders, projects, preferences, builderSkills, skills, builderTraits, traits
} from '../config/schema/index.js';
import { eq, inArray } from 'drizzle-orm';
import normalize from '../utils/normalize.js';
import { sql } from 'drizzle-orm';

export async function RetrieverAgent(plan) {
  console.log("RetrieverAgent: Using plan →", plan);

  const qEmbed = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: plan.keywords.join(' ')
  }).then(r => r.data[0].embedding);

  const pineconeFilter = {};
  if (plan.minExperience) {
    pineconeFilter.experienceYears = { $gte: plan.minExperience };
  }
  if (plan.availability) {
    const avail = plan.availability.toLowerCase();
    if (avail.includes('weekend') || avail.includes('flexible')) {
      pineconeFilter.availability = { $in: ['Flexible', 'Weekends only', 'Part-time'] };
    } else {
      pineconeFilter.availability = { $eq: plan.availability };
    }
  }

  const vectorResults = await index.query({
    vector: qEmbed,
    topK: 50,
    includeMetadata: true,
    filter: Object.keys(pineconeFilter).length > 0 ? pineconeFilter : undefined
  });

  const candidateIds = vectorResults.matches.map(m => parseInt(m.id));
  if (candidateIds.length === 0) return [];

  const builderData = await db
    .select({
      builder: builders,
      skill: skills.name,
      trait: traits.name,
      hackType: sql`${preferences.hackathonTypes}`.mapWith(preferences.hackathonTypes)
    })
    .from(builders)
    .leftJoin(builderSkills, eq(builderSkills.builderId, builders.id))
    .leftJoin(skills, eq(skills.id, builderSkills.skillId))
    .leftJoin(builderTraits, eq(builderTraits.builderId, builders.id))
    .leftJoin(traits, eq(traits.id, builderTraits.traitId))
    .leftJoin(preferences, eq(preferences.builderId, builders.id))
    .where(inArray(builders.id, candidateIds));

  const grouped = new Map();
  for (const row of builderData) {
    const b = row.builder;
    if (!grouped.has(b.id)) {
      grouped.set(b.id, {
        ...b,
        skills: new Set(),
        traits: new Set(),
        hackathonTypes: new Set(),
        vectorScore: vectorResults.matches.find(m => m.id === b.id.toString())?.score || 0
      });
    }
    const profile = grouped.get(b.id);
    if (row.skill) profile.skills.add(row.skill);
    if (row.trait) profile.traits.add(row.trait);
    if (row.hackType) {
      row.hackType.forEach(type => profile.hackathonTypes.add(type));
    }
  }

  const results = Array.from(grouped.values()).map(p => {
    const pSkills = Array.from(p.skills).map(normalize);
    const pTraits = Array.from(p.traits).map(normalize);
    const pHackTypes = Array.from(p.hackathonTypes).map(normalize);
    const pHeadline = normalize(p.headline);

    const skillMatch = plan.requiredSkills.length > 0 && plan.requiredSkills.some(req => {
      const reqNorm = normalize(req);
      return pSkills.some(ps => ps.includes(reqNorm) || reqNorm.includes(ps)) ||
             pHeadline.includes(reqNorm);
    }) ? 3 : 0;

    const traitMatch = plan.preferredTraits.length > 0 && plan.preferredTraits.some(t => {
      const tNorm = normalize(t);
      return pTraits.some(pt => pt.includes(tNorm) || tNorm.includes(pt));
    }) ? 1 : 0;


    const hackMatch = plan.hackathonTypes.length > 0 && plan.hackathonTypes.some(h => {
      const hNorm = normalize(h);
      return pHackTypes.some(ht => ht.includes(hNorm) || hNorm.includes(ht));
    }) ? 2 : 0;

    const matchScore = skillMatch + traitMatch + hackMatch;
    const totalScore = Math.min(
      (p.vectorScore * 0.6) + (matchScore * 0.4),
      1.0
    );

    return {
      ...p,
      skills: Array.from(p.skills),
      traits: Array.from(p.traits),
      hackathonTypes: Array.from(p.hackathonTypes),
      matchScore,
      totalScore
    };
  });

  return results
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 20);
}