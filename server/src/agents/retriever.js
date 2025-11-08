import openai from '../utils/openai.js';
import index from '../utils/pinecone.js';
import { db } from '../config/db.js';
import { builders } from '../config/schema/builders.js';
import { builderSkills, skills } from '../config/schema/skills.js';
import { ilike, inArray, or } from 'drizzle-orm';

export async function RetrieverAgent(plan) {
  const requiredSkills = Array.isArray(plan.requiredSkills) ? plan.requiredSkills : [];
  const keywords = Array.isArray(plan.keywords) ? plan.keywords : [];
  const searchTerms = [...requiredSkills, ...keywords].join(' ');

  let locationMatchedIds = null;
  const rawLocation = typeof plan.location === 'string' ? plan.location.trim() : '';
  const locationTokens = rawLocation.length > 0
    ? rawLocation
        .split(/[,|]/)
        .map((loc) => loc.trim())
        .filter((loc) => loc.length > 0)
    : [];

  if (locationTokens.length > 0) {
    const predicates = locationTokens.map((loc) => {
      const normalized = loc.replace(/\s+/g, ' ');
      return ilike(builders.location, `%${normalized}%`);
    });

    try {
      const rows = await db
        .select({ id: builders.id })
        .from(builders)
        .where(predicates.length === 1 ? predicates[0] : or(...predicates))
        .limit(200);

      if (rows.length > 0) {
        locationMatchedIds = new Set(rows.map((row) => row.id));
      } else {
        console.log(`[RetrieverAgent] No PostgreSQL matches for locations "${locationTokens.join(', ')}"`);
      }
    } catch (err) {
      console.error('[RetrieverAgent] Location lookup failed', err);
    }
  }

  let skillMatchedIds = null;
  const normalizedSkills = requiredSkills
    .map((skill) => skill?.trim())
    .filter((skill) => typeof skill === 'string' && skill.length > 0);

  console.log("normalizedSkills", normalizedSkills);

  if (normalizedSkills.length > 0) {
    try {
      const predicates = normalizedSkills.map((skill) => ilike(skills.name, skill));
      const matchedSkills = await db
        .select({ id: skills.id })
        .from(skills)
        .where(predicates.length === 1 ? predicates[0] : or(...predicates));

      const matchedSkillIds = matchedSkills.map((row) => row.id);
      console.log("matchedSkillIds", matchedSkillIds);

      if (matchedSkillIds.length > 0) {
        const builderSkillRows = await db
          .select({
            builderId: builderSkills.builderId,
            skillId: builderSkills.skillId
          })
          .from(builderSkills)
          .where(inArray(builderSkills.skillId, matchedSkillIds));
        console.log("builderSkillRows", builderSkillRows);

        if (builderSkillRows.length > 0) {
          const requiredSkillIdSet = new Set(matchedSkillIds);
          console.log("requiredSkillIdSet", requiredSkillIdSet);
          const builderSkillMap = new Map();

          for (const row of builderSkillRows) {
            if (!builderSkillMap.has(row.builderId)) {
              builderSkillMap.set(row.builderId, new Set());
            }
            builderSkillMap.get(row.builderId).add(row.skillId);
          }

          console.log("builderSkillMap", builderSkillMap);

          const qualifiedBuilders = [];
          for (const [builderId, skillIdSet] of builderSkillMap.entries()) {
            let hasAll = true;
            for (const skillId of requiredSkillIdSet) {
              if (!skillIdSet.has(skillId)) {
                hasAll = false;
                break;
              }
            }
            
            if (hasAll) {
              qualifiedBuilders.push(builderId);
            }
          }

          if (qualifiedBuilders.length > 0) {
            skillMatchedIds = new Set(qualifiedBuilders);
          }
        }
      }
    } catch (err) {
      console.error('[RetrieverAgent] Skill lookup failed', err);
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

  if (skillMatchedIds) {
    matches = matches.filter((m) => skillMatchedIds.has(parseInt(m.id, 10)));
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