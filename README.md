# **Teammate Matchmaking Agent**  
**Find Your Perfect Hackathon Teammate — In Seconds**  

video demo link:
https://drive.google.com/file/d/1XvOOYAN8qUp9_7Uxhoho4L2s3M5Kaw_G/view?usp=sharing
---

> **You type:** `need full stack engineer in Mumbai with React`  
> **We find:** `Xander Patel — Mumbai, IN — Node.js + Vue — available weekends`  
> **In under 100ms. With full reasoning. No latency.**

---

## **The Problem It Solves**

Finding the **right teammate** for a hackathon is **hard**.  
You post in 10 groups. Wait hours. Get 20 replies.  
**None match.**  
Or worse: someone *says* they know React — but **can’t code**.  
You lose 24 hours. You lose the hackathon.

**This agent fixes that.**  
It’s your **AI-powered teammate scout** — fast, accurate, and **self-correcting**.

---

## **Live Demo**

**Frontend:** `http://localhost:3000`  
**Backend API:** `http://localhost:3004/ask`

```bash
curl -X POST http://localhost:3004/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "need full stack engineer in San Francisco"}'
```

---

## **Tech Stack**

| Layer | Tech |
|------|------|
| **AI** | `gpt-4o` (OpenAI) |
| **Vector DB** | `Pinecone` |
| **SQL** | `PostgreSQL` + `Drizzle ORM` |
| **NoSQL** | `MongoDB` + `Mongoose` |
| **Background Jobs** | `BullMQ` + `Redis` |
| **API** | `Express.js` |
| **Frontend** | `nextjs` |

---

## **Architecture Overview**

```mermaid
graph TD
    A[User Query] --> B[PlannerAgent]
    B --> C[RetrieverAgent]
    C --> D[EvaluatorAgent]
    D -->|confidence < 0.8| E[RefinerAgent]
    E --> C
    D -->|≥ 0.8| F[RankerAgent]
    F --> G[Response]
    C --> H[Background Logging]
    E --> H
    H --> I[MongoDB]
```

---

## **How It Works (Step-by-Step)**

1. **You Ask**  
   ```text
   "need full stack engineer in Mumbai"
   ```

2. **PlannerAgent** → Turns words into a **search plan**  
   ```json
   { "location": "Mumbai", "requiredSkills": ["React", "Node.js"] }
   ```

3. **RetrieverAgent** → **Searches wide, filters smart**  
   - `topK: 50` in Pinecone (AI similarity)  
   - Light filter: only experience  
   - **Post-filter in JS**: exact location + all skills

4. **EvaluatorAgent** → Scores confidence (0.0–1.0)  
   ```text
   Confidence: 0.9 → "Xander is in Mumbai"
   ```

5. **RefinerAgent** → Fixes plan if needed  
   ```diff
   - location: "Mumbai"
   + location: "Mumbai or Bangalore"
   ```

6. **RankerAgent** → Explains top 3  
   ```json
   "Xander is ideal: Full-Stack + Mumbai + 3 yrs"
   ```

7. **Background Logging** → **Zero latency**  
   - All steps saved in MongoDB  
   - Runs via **BullMQ + Redis**

---

## **Setup (3 Terminals)**

### **Terminal 1: Redis**
```bash
redis-server
```

### **Terminal 2: Background Worker**
```bash
cd server
node src/workers/logWorker.js
```

### **Terminal 3: Backend**
```bash
cd server
npm install
npm run dev
```

### **Terminal 4: Frontend**
```bash
cd client
npm install
npm run dev
```

> **Open:** `http://localhost:3000`

---

## **Environment Variables (`.env`) for backend**

```env
PORT=3004
DATABASE_URL='postgresql://karthiknadar1204:Fvph9DyfVm2L@ep-restless-credit-a1c7489o-pooler.ap-southeast-1.aws.neon.tech/devfolio?sslmode=require&channel_binding=require'
MONGO_URI='mongodb+srv://karthiknadar1204_db_user:ruPDLQkO0QGvcIy3@devfolio.crmjara.mongodb.net/?appName=devfolio'
PINECONE_API_KEY='pcsk_64bw4_Mw6nhP7MrawTADPZUdk4n76KvZR6kcQ9Ejse2i2xbKnh7hopEhUKgdGZeWbBz1i'
OPENAI_API_KEY='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'
REDIS_URL=redis://localhost:6379
```
openai api key might need to be re generated as it gets auto disabled when exposed,rest dbs you can check via dbeaver or beekeeper studio

> **Already seeded + vectorized** — just run!

---

## **Test Queries (Try These!)**

| Query | Expected |
|------|----------|
| `need full stack engineer in San Francisco, CA` | **Aria Patel** |
| `need mobile developer in Seoul with React Native` | **Luna Kim** |
| `need blockchain developer in Berlin` | **Milo Garcia** |
| `need AI researcher in Toronto` | **Kai Chen** |
| `need full stack dev in Mumbai` | **Xander Patel** |
| `need React + Node.js developer with 5+ years` | **Aria Patel, Gia Chen** |
| `need DevOps engineer with Kubernetes and 8+ years` | **Sage Rivera** |
| `need frontend wizard with React and TypeScript` | **Ulysses Martinez** |
| `need full stack engineer in Beijing, flexible availability` | **Gia Chen** |
| `need part-time blockchain dev` | **Milo Garcia, Toby Chen** |
| `need weekend-only developer in Mumbai` | **Xander Patel** |
| `need someone who knows Docker and PostgreSQL` | **Aria Patel, Gia Chen** |
| `need backend guru with Go` | **Vera Nguyen, Leo Chen** |
| `need game developer in Seoul` | **0 results** |
| `need React + TypeScript dev in Barcelona` | **Ulysses Martinez** |
| `need Flutter dev in Busan` | **Sasha Kim** |
| `need someone in Remote` | **Orion Lopez, Ada Wilson** |
| `need DevOps in Bangalore` | **Finn Patel** |
| `need full stack with 0 years experience` | **0 results** |

---

## **Key Design Decisions**

| **We Did** | **Why It’s Smart** |
|-----------|---------------------|
| **Broad vector search** | Finds *similar* people in **milliseconds** |
| **Post-filtering in JS** | Enforces **"has all"** logic — **no false matches** |
| **Refiner constrained** | Stops AI from adding junk like `"willingToRelocate"` |
| **Background logging** | **Zero latency** — full audit trail |

---

## **Trade-Offs**

| **Optimized For** | **Sacrificed** | **Why** |
|------------------|---------------|--------|
| **Precision** | Recall | Better to say "no one" than show the wrong person |
| **Speed** | Geolocation | Hackathons are **in-person or remote** — not "50km radius" |
| **Simplicity** | Traits | "Team player" = noise. **Skills > labels** |

---

## **Challenges & Wins**

The **RetrieverAgent** was the **hardest part** — the one that made or broke the entire agent. I was tackling **data mismatches**, **SQL joins**, and **"has all skills" logic** — all while keeping latency under 100ms.

At first, I thought: *"Just use vector search."*  
But that failed — because **"React" + "Node.js"** needs **both**, not **either**.

So I built a **hybrid search system**:

> **SQL for truth. Pinecone for discovery.**

### **The Evolution: 4 Stages of RetrieverAgent**

| Stage | What I Did | Problem | Fix |
|------|-----------|-------|-----|
| **1. Vector Only** | `topK: 75` in Pinecone | Found *similar*, not *exact* | Too loose |
| **2. Pinecone Filters** | `location: "Mumbai"` | 0 results | Too strict |
| **3. SQL + Pinecone Hybrid** | SQL for **location** + **all skills** → ID sets | **Complex joins** | **Winner** |
| **4. Smart Fallback** | If 0 → drop skills → keep location | Never stuck | **Robust** |

### **Retriever Agent Accuracy Optimizations**

- **Hybrid query construction**  
  - Normalize `plan.requiredSkills` and `plan.keywords`, concatenate them into a single natural‑language `searchTerms` string, and embed with `text-embedding-3-small`. This keeps the Pinecone query aligned with both structured skills and broader keywords.

- **Location pre-filter in Postgres**  
  - Parse `plan.location` into comma/pipe-delimited tokens, clean whitespace, and build `ilike(builders.location, %token%)` predicates.  
  - Run a `SELECT` against the `builders` table (limit 200) and collect matching builder IDs in a `Set`. This enforces **hard location constraints before the vector search**.

- **Exact skill coverage check in Postgres**  
  - Trim required skills, `ilike` match each against the `skills` table to capture normalization/spelling variance, then grab their IDs.  
  - Fetch rows from the `builderSkills` junction table for those skill IDs.  
  - Build a `Map<builderId, Set<skillId>>` and **keep only builders whose skill set fully covers the required skills**. The resulting builder IDs form a second filter `Set`.

- **Pinecone vector search with metadata filter**  
  - Query the index with the embedding, `topK: 75`, `includeMetadata: true`, and an optional filter on `experienceYears` (e.g., `{ $gte: plan.minExperience }`). This limits vector search to candidates satisfying experience thresholds.

- **Post-query cross-filtering**  
  - Apply the location and skill `Set` filters to Pinecone matches (`builderId` parsed from the Pinecone match ID).  
  - If the intersection is empty but there were Postgres location matches, **fall back to location-only matches** to avoid zero results.  
  - Return normalized match objects with Pinecone metadata such as `name`, `headline`, `location`, `skills`, and the similarity score.


## **Future Extensions**

- [ ] Geolocation (if needed)  
- [ ] Skill synonyms (`JS` → `JavaScript`)  
- [ ] User feedback loop  

---

## **You Don’t Search. You Discover.**

**Type. Match. Build. Win.**
---
