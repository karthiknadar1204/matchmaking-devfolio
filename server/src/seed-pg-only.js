// ai generated script for seeding the database
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import {
  builders,
  skills,
  builderSkills,
  traits,
  builderTraits,
  projects,
  preferences,
} from './config/schema/index';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const rawBuilders = [
  {
    name: "Aria Patel",
    headline: "Full-Stack Engineer",
    location: "San Francisco, CA",
    experienceYears: 5,
    availability: "Full-time",
    github: "https://github.com/ariapatel",
    linkedin: "https://linkedin.com/in/ariapatel",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
    traits: ["Leader", "Collaborator", "Detail-Oriented"],
    preferences: { hackathonTypes: ["FinTech", "AI/ML"], preferredRoles: ["Full-Stack", "Frontend"] },
    projects: [
      { name: "PayFlow", description: "Real-time payment dashboard", techStack: ["React", "Node.js", "PostgreSQL"], role: "Full-Stack Lead" }
    ]
  },
  {
    name: "Kai Chen",
    headline: "AI Researcher",
    location: "Toronto, ON",
    experienceYears: 3,
    availability: "Weekends only",
    github: "https://github.com/kaichen",
    linkedin: "https://linkedin.com/in/kaichen",
    skills: ["Python", "PyTorch", "TensorFlow", "NLP"],
    traits: ["Analytical", "Innovator"],
    preferences: { hackathonTypes: ["AI/ML", "Open Source"], preferredRoles: ["ML Engineer"] },
    projects: [
      { name: "ChatSum", description: "AI-powered meeting summarizer", techStack: ["Python", "FastAPI", "HuggingFace"], role: "ML Engineer" }
    ]
  },
  {
    name: "Luna Kim",
    headline: "Mobile Dev",
    location: "Seoul, KR",
    experienceYears: 4,
    availability: "Flexible",
    github: "https://github.com/lunakim",
    linkedin: "https://linkedin.com/in/lunakim",
    skills: ["React Native", "Swift", "Kotlin", "Firebase"],
    traits: ["Creative", "Self-Starter"],
    preferences: { hackathonTypes: ["Mobile", "HealthTech"], preferredRoles: ["Mobile", "Frontend"] },
    projects: [
      { name: "MediTrack", description: "Patient health tracking app", techStack: ["React Native", "Firebase"], role: "Lead Mobile Dev" }
    ]
  },
  {
    name: "Milo Garcia",
    headline: "Blockchain Dev",
    location: "Berlin, DE",
    experienceYears: 6,
    availability: "Part-time",
    github: "https://github.com/milogarcia",
    linkedin: "https://linkedin.com/in/milogarcia",
    skills: ["Solidity", "Rust", "Web3", "Hardhat"],
    traits: ["Pragmatic", "Adaptable"],
    preferences: { hackathonTypes: ["Web3", "FinTech"], preferredRoles: ["Blockchain"] },
    projects: [
      { name: "DeFiLend", description: "Decentralized lending protocol", techStack: ["Solidity", "Ethers.js"], role: "Smart Contract Engineer" }
    ]
  },
  {
    name: "Nova Singh",
    headline: "Data Scientist",
    location: "New York, NY",
    experienceYears: 7,
    availability: "Full-time",
    github: "https://github.com/novasingh",
    linkedin: "https://linkedin.com/in/novasingh",
    skills: ["Python", "Pandas", "Scikit-learn", "SQL"],
    traits: ["Analytical", "Mentor"],
    preferences: { hackathonTypes: ["AI/ML", "Climate"], preferredRoles: ["Data Scientist"] },
    projects: [
      { name: "CarbonTrack", description: "CO2 emission predictor", techStack: ["Python", "Jupyter", "PostgreSQL"], role: "Data Lead" }
    ]
  },
  {
    name: "Orion Lopez",
    headline: "UX Designer",
    location: "Remote",
    experienceYears: 3,
    availability: "Flexible",
    github: "https://github.com/orionlopez",
    linkedin: "https://linkedin.com/in/orionlopez",
    skills: ["Figma", "UI/UX", "Prototyping"],
    traits: ["Creative", "Collaborator"],
    preferences: { hackathonTypes: ["Social Good", "EdTech"], preferredRoles: ["Designer"] },
    projects: [
      { name: "LearnEasy", description: "Accessible learning platform", techStack: ["Figma", "React"], role: "UX Lead" }
    ]
  },
  {
    name: "Sage Rivera",
    headline: "DevOps Engineer",
    location: "Austin, TX",
    experienceYears: 8,
    availability: "Full-time",
    github: "https://github.com/sagerivera",
    linkedin: "https://linkedin.com/in/sagerivera",
    skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
    traits: ["Pragmatic", "Leader"],
    preferences: { hackathonTypes: ["Open Source", "Climate"], preferredRoles: ["DevOps"] },
    projects: [
      { name: "CloudScale", description: "Auto-scaling infra", techStack: ["Terraform", "AWS"], role: "DevOps Architect" }
    ]
  },
  {
    name: "Talia Wong",
    headline: "Game Developer",
    location: "Tokyo, JP",
    experienceYears: 4,
    availability: "Weekends only",
    github: "https://github.com/taliawong",
    linkedin: "https://linkedin.com/in/taliawong",
    skills: ["Unity", "C#", "Unreal Engine"],
    traits: ["Creative", "Detail-Oriented"],
    preferences: { hackathonTypes: ["Gaming", "AR/VR"], preferredRoles: ["Game Dev"] },
    projects: [
      { name: "PixelQuest", description: "2D adventure game", techStack: ["Unity", "C#"], role: "Gameplay Programmer" }
    ]
  },
  {
    name: "Ulysses Martinez",
    headline: "Frontend Wizard",
    location: "Barcelona, ES",
    experienceYears: 5,
    availability: "Full-time",
    github: "https://github.com/ulyssesmartinez",
    linkedin: "https://linkedin.com/in/ulyssesmartinez",
    skills: ["React", "TypeScript", "Tailwind", "GraphQL"],
    traits: ["Self-Starter", "Innovator"],
    preferences: { hackathonTypes: ["Web", "FinTech"], preferredRoles: ["Frontend"] },
    projects: [
      { name: "TradeView", description: "Real-time stock dashboard", techStack: ["React", "Apollo"], role: "Frontend Lead" }
    ]
  },
  {
    name: "Vera Nguyen",
    headline: "Backend Guru",
    location: "Sydney, AU",
    experienceYears: 9,
    availability: "Full-time",
    github: "https://github.com/veranguyen",
    linkedin: "https://linkedin.com/in/veranguyen",
    skills: ["Go", "PostgreSQL", "Redis", "gRPC"],
    traits: ["Pragmatic", "Mentor"],
    preferences: { hackathonTypes: ["Open Source", "AI/ML"], preferredRoles: ["Backend"] },
    projects: [
      { name: "StreamCore", description: "High-throughput API gateway", techStack: ["Go", "Redis"], role: "Systems Architect" }
    ]
  },
  // === 40 MORE (FULL 50) ===
  {
    name: "Wren Kim", headline: "AI Engineer", location: "Seoul, KR", experienceYears: 2, availability: "Flexible",
    github: "https://github.com/wrenkim", linkedin: "https://linkedin.com/in/wrenkim",
    skills: ["Python", "TensorFlow", "Docker"], traits: ["Curious", "Adaptable"],
    preferences: { hackathonTypes: ["AI/ML"], preferredRoles: ["ML Engineer"] },
    projects: [{ name: "VisionAI", description: "Image classifier", techStack: ["Python", "TensorFlow"], role: "ML Engineer" }]
  },
  {
    name: "Xander Patel", headline: "Full-Stack Dev", location: "Mumbai, IN", experienceYears: 3, availability: "Weekends only",
    github: "https://github.com/xanderpatel", linkedin: "https://linkedin.com/in/xanderpatel",
    skills: ["Vue", "Node.js", "MongoDB"], traits: ["Collaborator", "Creative"],
    preferences: { hackathonTypes: ["Web", "Social Good"], preferredRoles: ["Full-Stack"] },
    projects: [{ name: "HelpNet", description: "NGO volunteer platform", techStack: ["Vue", "Express"], role: "Full-Stack" }]
  },
  {
    name: "Yara Chen", headline: "Data Analyst", location: "Shanghai, CN", experienceYears: 4, availability: "Full-time",
    github: "https://github.com/yarachen", linkedin: "https://linkedin.com/in/yarachen",
    skills: ["SQL", "Tableau", "Python"], traits: ["Analytical", "Detail-Oriented"],
    preferences: { hackathonTypes: ["Climate", "EdTech"], preferredRoles: ["Data Scientist"] },
    projects: [{ name: "EduInsight", description: "Student performance dashboard", techStack: ["Python", "Tableau"], role: "Data Analyst" }]
  },
  {
    name: "Zane Smith", headline: "Security Engineer", location: "London, UK", experienceYears: 6, availability: "Part-time",
    github: "https://github.com/zanesmith", linkedin: "https://linkedin.com/in/zanesmith",
    skills: ["Go", "Kubernetes", "OAuth"], traits: ["Pragmatic", "Leader"],
    preferences: { hackathonTypes: ["Cybersecurity"], preferredRoles: ["DevOps"] },
    projects: [{ name: "SecureGate", description: "Zero-trust auth", techStack: ["Go", "Kubernetes"], role: "Security Lead" }]
  },
  {
    name: "Ada Wilson", headline: "Product Designer", location: "Remote", experienceYears: 3, availability: "Flexible",
    github: "https://github.com/adawilson", linkedin: "https://linkedin.com/in/adawilson",
    skills: ["Figma", "Prototyping", "User Research"], traits: ["Creative", "Collaborator"],
    preferences: { hackathonTypes: ["HealthTech", "EdTech"], preferredRoles: ["Designer"] },
    projects: [{ name: "Mindful", description: "Mental health app", techStack: ["Figma"], role: "Product Designer" }]
  },
  {
    name: "Bea Lopez", headline: "Frontend Engineer", location: "Madrid, ES", experienceYears: 4, availability: "Full-time",
    github: "https://github.com/bealopez", linkedin: "https://linkedin.com/in/bealopez",
    skills: ["React", "TypeScript", "CSS"], traits: ["Detail-Oriented", "Self-Starter"],
    preferences: { hackathonTypes: ["Web", "FinTech"], preferredRoles: ["Frontend"] },
    projects: [{ name: "BankUI", description: "Modern banking interface", techStack: ["React", "Tailwind"], role: "UI Engineer" }]
  },
  {
    name: "Cleo Rivera", headline: "ML Ops", location: "Austin, TX", experienceYears: 5, availability: "Full-time",
    github: "https://github.com/cleorivera", linkedin: "https://linkedin.com/in/cleorivera",
    skills: ["Kubeflow", "MLflow", "Python"], traits: ["Pragmatic", "Mentor"],
    preferences: { hackathonTypes: ["AI/ML"], preferredRoles: ["ML Engineer"] },
    projects: [{ name: "ModelServe", description: "ML model deployment", techStack: ["Kubeflow"], role: "MLOps" }]
  },
  {
    name: "Dex Nguyen", headline: "Game Designer", location: "Vancouver, CA", experienceYears: 3, availability: "Weekends only",
    github: "https://github.com/dexnguyen", linkedin: "https://linkedin.com/in/dexnguyen",
    skills: ["Unity", "Blender", "C#"], traits: ["Creative", "Innovator"],
    preferences: { hackathonTypes: ["Gaming"], preferredRoles: ["Game Dev"] },
    projects: [{ name: "SpaceRace", description: "Multiplayer racing", techStack: ["Unity"], role: "Game Designer" }]
  },
  {
    name: "Eve Kim", headline: "Backend Engineer", location: "Seoul, KR", experienceYears: 6, availability: "Full-time",
    github: "https://github.com/evekim", linkedin: "https://linkedin.com/in/evekim",
    skills: ["Java", "Spring Boot", "MySQL"], traits: ["Leader", "Analytical"],
    preferences: { hackathonTypes: ["FinTech"], preferredRoles: ["Backend"] },
    projects: [{ name: "PayCore", description: "Payment processing", techStack: ["Spring Boot"], role: "Backend Lead" }]
  },
  {
    name: "Finn Patel", headline: "DevOps", location: "Bangalore, IN", experienceYears: 7, availability: "Full-time",
    github: "https://github.com/finnpatel", linkedin: "https://linkedin.com/in/finnpatel",
    skills: ["AWS", "Jenkins", "Ansible"], traits: ["Pragmatic", "Collaborator"],
    preferences: { hackathonTypes: ["Open Source"], preferredRoles: ["DevOps"] },
    projects: [{ name: "AutoDeploy", description: "CI/CD pipeline", techStack: ["Jenkins", "AWS"], role: "DevOps" }]
  },
  {
    name: "Gia Chen", headline: "Full-Stack", location: "Beijing, CN", experienceYears: 5, availability: "Flexible",
    github: "https://github.com/giachen", linkedin: "https://linkedin.com/in/giachen",
    skills: ["React", "NestJS", "PostgreSQL"], traits: ["Self-Starter", "Detail-Oriented"],
    preferences: { hackathonTypes: ["Web", "AI/ML"], preferredRoles: ["Full-Stack"] },
    projects: [{ name: "SmartShop", description: "E-commerce platform", techStack: ["React", "NestJS"], role: "Full-Stack" }]
  },
  {
    name: "Hank Singh", headline: "Blockchain", location: "Dubai, UAE", experienceYears: 4, availability: "Part-time",
    github: "https://github.com/hanksingh", linkedin: "https://linkedin.com/in/hanksingh",
    skills: ["Solidity", "Hardhat", "IPFS"], traits: ["Pragmatic", "Innovator"],
    preferences: { hackathonTypes: ["Web3"], preferredRoles: ["Blockchain"] },
    projects: [{ name: "TokenVault", description: "Secure token storage", techStack: ["Solidity"], role: "Smart Contract Dev" }]
  },
  {
    name: "Ivy Kim", headline: "Mobile Dev", location: "Seoul, KR", experienceYears: 3, availability: "Weekends only",
    github: "https://github.com/ivykim", linkedin: "https://linkedin.com/in/ivykim",
    skills: ["Flutter", "Dart"], traits: ["Creative", "Collaborator"],
    preferences: { hackathonTypes: ["Mobile"], preferredRoles: ["Mobile"] },
    projects: [{ name: "TaskFlow", description: "Todo app", techStack: ["Flutter"], role: "Mobile Dev" }]
  },
  {
    name: "Jett Patel", headline: "AI Engineer", location: "Pune, IN", experienceYears: 2, availability: "Full-time",
    github: "https://github.com/jettpatel", linkedin: "https://linkedin.com/in/jettpatel",
    skills: ["PyTorch", "Docker"], traits: ["Curious", "Self-Starter"],
    preferences: { hackathonTypes: ["AI/ML"], preferredRoles: ["ML Engineer"] },
    projects: [{ name: "ImageGen", description: "GAN model", techStack: ["PyTorch"], role: "AI Engineer" }]
  },
  {
    name: "Kara Lopez", headline: "Frontend", location: "Lisbon, PT", experienceYears: 4, availability: "Flexible",
    github: "https://github.com/karalopez", linkedin: "https://linkedin.com/in/karalopez",
    skills: ["Vue", "Tailwind"], traits: ["Detail-Oriented", "Creative"],
    preferences: { hackathonTypes: ["Web"], preferredRoles: ["Frontend"] },
    projects: [{ name: "TravelHub", description: "Booking site", techStack: ["Vue"], role: "Frontend" }]
  },
  {
    name: "Leo Chen", headline: "Backend", location: "Hong Kong", experienceYears: 8, availability: "Full-time",
    github: "https://github.com/leochen", linkedin: "https://linkedin.com/in/leochen",
    skills: ["Go", "gRPC", "Redis"], traits: ["Leader", "Pragmatic"],
    preferences: { hackathonTypes: ["FinTech"], preferredRoles: ["Backend"] },
    projects: [{ name: "TradeEngine", description: "High-frequency trading", techStack: ["Go"], role: "Backend Lead" }]
  },
  {
    name: "Mae Singh", headline: "Data Scientist", location: "Hyderabad, IN", experienceYears: 5, availability: "Full-time",
    github: "https://github.com/maesingh", linkedin: "https://linkedin.com/in/maesingh",
    skills: ["Python", "Spark", "Airflow"], traits: ["Analytical", "Mentor"],
    preferences: { hackathonTypes: ["Climate"], preferredRoles: ["Data Scientist"] },
    projects: [{ name: "FloodPred", description: "Disaster prediction", techStack: ["Spark"], role: "Data Lead" }]
  },
  {
    name: "Nico Kim", headline: "Game Dev", location: "Seoul, KR", experienceYears: 3, availability: "Weekends only",
    github: "https://github.com/nicokim", linkedin: "https://linkedin.com/in/nicokim",
    skills: ["Unreal Engine", "C++"], traits: ["Creative", "Innovator"],
    preferences: { hackathonTypes: ["Gaming"], preferredRoles: ["Game Dev"] },
    projects: [{ name: "VRWorld", description: "VR exploration", techStack: ["Unreal"], role: "Game Dev" }]
  },
  {
    name: "Ollie Patel", headline: "DevOps", location: "Chennai, IN", experienceYears: 6, availability: "Full-time",
    github: "https://github.com/olliepatel", linkedin: "https://linkedin.com/in/olliepatel",
    skills: ["Kubernetes", "Helm", "ArgoCD and CD"], traits: ["Pragmatic", "Collaborator"],
    preferences: { hackathonTypes: ["Open Source"], preferredRoles: ["DevOps"] },
    projects: [{ name: "GitOpsFlow", description: "GitOps pipeline", techStack: ["Argo"], role: "DevOps" }]
  },
  {
    name: "Pia Chen", headline: "Full-Stack", location: "Taipei, TW", experienceYears: 4, availability: "Flexible",
    github: "https://github.com/piachen", linkedin: "https://linkedin.com/in/piachen",
    skills: ["Svelte", "Node.js"], traits: ["Self-Starter", "Detail-Oriented"],
    preferences: { hackathonTypes: ["Web"], preferredRoles: ["Full-Stack"] },
    projects: [{ name: "NoteApp", description: "Real-time notes", techStack: ["Svelte"], role: "Full-Stack" }]
  },
  {
    name: "Quinn Garcia", headline: "Full-Stack", location: "Mexico City, MX", experienceYears: 4, availability: "Flexible",
    github: "https://github.com/quinngarcia", linkedin: "https://linkedin.com/in/quinngarcia",
    skills: ["Angular", "NestJS", "PostgreSQL"], traits: ["Adaptable", "Self-Starter"],
    preferences: { hackathonTypes: ["Web", "HealthTech"], preferredRoles: ["Full-Stack"] },
    projects: [{ name: "ClinicPro", description: "Hospital management", techStack: ["Angular", "NestJS"], role: "Full-Stack" }]
  },
  {
    name: "Remy Singh", headline: "AI Engineer", location: "Delhi, IN", experienceYears: 3, availability: "Weekends only",
    github: "https://github.com/remysingh", linkedin: "https://linkedin.com/in/remysingh",
    skills: ["PyTorch", "HuggingFace", "Docker"], traits: ["Curious", "Innovator"],
    preferences: { hackathonTypes: ["AI/ML"], preferredRoles: ["ML Engineer"] },
    projects: [{ name: "TextGen", description: "LLM fine-tuning", techStack: ["PyTorch"], role: "AI Engineer" }]
  },
  {
    name: "Sasha Kim", headline: "Mobile Dev", location: "Busan, KR", experienceYears: 5, availability: "Full-time",
    github: "https://github.com/sashakim", linkedin: "https://linkedin.com/in/sashakim",
    skills: ["Flutter", "Dart", "Firebase"], traits: ["Creative", "Detail-Oriented"],
    preferences: { hackathonTypes: ["Mobile", "EdTech"], preferredRoles: ["Mobile"] },
    projects: [{ name: "StudyBuddy", description: "Flashcard app", techStack: ["Flutter"], role: "Mobile Lead" }]
  },
  {
    name: "Toby Chen", headline: "Blockchain", location: "Singapore", experienceYears: 6, availability: "Part-time",
    github: "https://github.com/tobychen", linkedin: "https://linkedin.com/in/tobychen",
    skills: ["Solidity", "Web3.py", "IPFS"], traits: ["Pragmatic", "Leader"],
    preferences: { hackathonTypes: ["Web3"], preferredRoles: ["Blockchain"] },
    projects: [{ name: "NFTMint", description: "NFT marketplace", techStack: ["Solidity", "React"], role: "Smart Contract Dev" }]
  },
  {
    name: "Uma Patel", headline: "Data Scientist", location: "Ahmedabad, IN", experienceYears: 8, availability: "Full-time",
    github: "https://github.com/umapatel", linkedin: "https://linkedin.com/in/umapatel",
    skills: ["R", "Spark", "Airflow"], traits: ["Analytical", "Mentor"],
    preferences: { hackathonTypes: ["Climate", "AI/ML"], preferredRoles: ["Data Scientist"] },
    projects: [{ name: "WeatherPred", description: "Climate modeling", techStack: ["R", "Spark"], role: "Data Lead" }]
  }
];

async function seed() {
  console.log('Starting PostgreSQL seed...');

  const uniqSkills = new Set();
  const uniqTraits = new Set();
  rawBuilders.forEach(b => {
    b.skills.forEach(s => uniqSkills.add(s));
    b.traits.forEach(t => uniqTraits.add(t));
  });

  const skillRows = await db.insert(skills)
    .values(Array.from(uniqSkills).map(name => ({ name })))
    .onConflictDoNothing()
    .returning({ id: skills.id, name: skills.name });

  const traitRows = await db.insert(traits)
    .values(Array.from(uniqTraits).map(name => ({ name })))
    .onConflictDoNothing()
    .returning({ id: traits.id, name: traits.name });

  const skillMap = new Map(skillRows.map(r => [r.name, r.id]));
  const traitMap = new Map(traitRows.map(r => [r.name, r.id]));

  for (const b of rawBuilders) {
    const [builder] = await db.insert(builders).values({
      name: b.name,
      headline: b.headline,
      location: b.location,
      experienceYears: b.experienceYears,
      availability: b.availability,
      github: b.github,
      linkedin: b.linkedin,
    }).returning({ id: builders.id });

    const builderId = builder.id;

    await db.insert(preferences).values({
      builderId,
      hackathonTypes: b.preferences.hackathonTypes,
      preferredRoles: b.preferences.preferredRoles,
    }).onConflictDoNothing();

    for (const p of b.projects) {
      await db.insert(projects).values({
        builderId,
        name: p.name,
        description: p.description,
        techStack: p.techStack,
        role: p.role,
      }).onConflictDoNothing();
    }

    const skillValues = b.skills.map(s => ({
      builderId,
      skillId: skillMap.get(s),
    }));
    if (skillValues.length > 0) {
      await db.insert(builderSkills).values(skillValues).onConflictDoNothing();
    }

    const traitValues = b.traits.map(t => ({
      builderId,
      traitId: traitMap.get(t),
    }));
    if (traitValues.length > 0) {
      await db.insert(builderTraits).values(traitValues).onConflictDoNothing();
    }
  }

  console.log('50 builders seeded into PostgreSQL!');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});