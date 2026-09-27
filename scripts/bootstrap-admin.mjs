import { createInterface } from "node:readline/promises"
import { stdin, stdout } from "node:process"
import * as argon2 from "argon2"
import { MongoClient } from "mongodb"

const permissions = ["admin.access", "admin.dashboard.read", "admin.login-attempts.manage", "rate-limits.manage", "metrics.read", "feedback.read", "feedback.moderate", "recommendation.read", "recommendation.manage", "blog.read", "blog.manage", "resume.catalog.read", "resume.catalog.manage", "admin.users.read", "admin.users.manage", "audit.read"]
const prompt = createInterface({ input: stdin, output: stdout })
const email = (await prompt.question("E-mail do superadmin: ")).trim().toLowerCase()
prompt.close()
if (!stdin.isTTY) throw new Error("O bootstrap exige um terminal interativo para ler a senha com segurança")
const password = await new Promise((resolve, reject) => {
  let value = ""
  stdout.write("Senha: ")
  stdin.setRawMode(true)
  stdin.resume()
  const done = () => { stdin.setRawMode(false); stdin.pause(); stdin.off("data", onData); stdout.write("\n"); resolve(value) }
  const onData = (chunk) => {
    const key = chunk.toString("utf8")
    if (key === "\r" || key === "\n") return done()
    if (key === "\u0003") { stdin.setRawMode(false); reject(new Error("Bootstrap cancelado")); return }
    if (key === "\u007f") { value = value.slice(0, -1); return }
    value += key
  }
  stdin.on("data", onData)
})
if (!/^\S+@\S+\.\S+$/.test(email) || !password) throw new Error("E-mail ou senha inválidos")
if (!process.env.MONGO_URL) throw new Error("MONGO_URL is required")
const client = new MongoClient(process.env.MONGO_URL)
await client.connect()
try {
  const db = client.db()
  const users = db.collection("admin_users")
  const roles = db.collection("admin_roles")
  const sessions = db.collection("admin_sessions")
  await users.createIndex({ email: 1 }, { unique: true })
  await sessions.createIndex({ sessionId: 1 }, { unique: true })
  await sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
  await roles.updateOne({ roleId: "superadmin" }, { $set: { roleId: "superadmin", name: "Superadmin", permissions, version: 1, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true })
  if (await users.findOne({ email })) {
    console.log("Superadmin já existe. As permissões do papel foram atualizadas.")
  } else {
    await users.insertOne({ email, passwordHash: await argon2.hash(password, { type: argon2.argon2id }), roleIds: ["superadmin"], status: "active", authorizationVersion: 1, passwordVersion: 1, createdAt: new Date(), updatedAt: new Date() })
    console.log("Superadmin criado.")
  }
} finally { await client.close() }
