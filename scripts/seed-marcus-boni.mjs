import { MongoClient } from "mongodb"
import { getMongoUrl } from "./lib/mongo-env.mjs"

const client = new MongoClient(getMongoUrl())
await client.connect()
try {
  const now = new Date()
  await client.db().collection("developer_recommendations").updateOne({ slug: "marcus-boni" }, { $set: { slug: "marcus-boni", status: "draft", displayName: "Marcus Boni", headline: "Software Engineer · Full Stack e IA aplicada", seniority: "mid-level", roleKinds: ["frontend", "backend"], skills: ["react", "typescript", "nextjs", "tailwindcss", "node"], summary: "Desenvolvedor full stack com experiência em aplicações web corporativas, integrações e fluxos de negócio.", contact: { label: "LinkedIn", url: "https://www.linkedin.com/in/marcus-boni-729a52243/" }, editorialPriority: 0, consent: { grantedAt: now, confirmedAt: now, version: "v1" }, updatedAt: now }, $setOnInsert: { createdAt: now } }, { upsert: true })
  console.log("Rascunho de Marcus Boni criado ou atualizado.")
} finally { await client.close() }
