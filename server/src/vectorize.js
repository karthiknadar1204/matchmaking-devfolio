import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import {
  builders,
  projects,
  preferences,
  builderSkills,
  builderTraits,
  skills,
  traits,
} from './config/schema/index';
import { eq, inArray } from 'drizzle-orm';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.Index('devfolio');


async function embedBuilder(profile) {
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

async function vectorize() {
  console.log('Starting vectorization...');

  const builderRows = await db
    .select({
      builder: builders,
      project: projects,
      preference: preferences,
    })
    .from(builders)
    .leftJoin(projects, eq(projects.builderId, builders.id))
    .leftJoin(preferences, eq(preferences.builderId, builders.id));

  const profiles = new Map();
  for (const row of builderRows) {
    const b = row.builder;
    if (!profiles.has(b.id)) {
      profiles.set(b.id, {
        ...b,
        skills: [],
        traits: [],
        projects: [],
        preferences: { hackathonTypes: [], preferredRoles: [] },
      });
    }
    const profile = profiles.get(b.id);
    if (row.project) profile.projects.push(row.project);
    if (row.preference) {
      profile.preferences.hackathonTypes = row.preference.hackathonTypes ?? [];
      profile.preferences.preferredRoles = row.preference.preferredRoles ?? [];
    }
  }

  for (const [id, profile] of profiles) {
    const skillIdRows = await db
      .select({ skillId: builderSkills.skillId })
      .from(builderSkills)
      .where(eq(builderSkills.builderId, id));

    if (skillIdRows.length > 0) {
      const skillIds = skillIdRows.map(r => r.skillId);
      const skillNames = await db
        .select({ name: skills.name })
        .from(skills)
        .where(inArray(skills.id, skillIds));
      profile.skills = skillNames.map(s => s.name);
    }

    const traitIdRows = await db
      .select({ traitId: builderTraits.traitId })
      .from(builderTraits)
      .where(eq(builderTraits.builderId, id));

    if (traitIdRows.length > 0) {
      const traitIds = traitIdRows.map(r => r.traitId);
      const traitNames = await db
        .select({ name: traits.name })
        .from(traits)
        .where(inArray(traits.id, traitIds));
      profile.traits = traitNames.map(t => t.name);
    }
  }

  for (const [id, profile] of profiles) {
    const embedding = await embedBuilder(profile);
    await index.upsert([
      {
        id: id.toString(),
        values: embedding,
        metadata: {
          name: profile.name,
          headline: profile.headline,
          location: profile.location,
          experienceYears: profile.experienceYears,
          availability: profile.availability,
        },
      },
    ]);
    console.log(`Vectorized: ${profile.name}`);
  }

  console.log('Vectorization complete! 50 builders in Pinecone.');
}

vectorize().catch(err => {
  console.error('Vectorization failed:', err);
  process.exit(1);
});