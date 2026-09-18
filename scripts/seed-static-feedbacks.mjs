import { MongoClient } from "mongodb"

if (!process.env.MONGO_URL) throw new Error("MONGO_URL is required")

const testimonials = [
  { key: "leonardo", displayName: "Leonardo", role: "CEO da Tech Legion", company: "Tech Legion", publicMessage: "É uma honra ter cruzado o caminho do Augusto Westphal e um orgulho estar ao seu lado, onde tive a oportunidade de conhecer um excelente profissional e uma pessoa incrível. Parabéns pelo projeto, meu nobre 👏." },
  { key: "emanuel", displayName: "Emanuel", role: "Desenvolvedor de Software", company: "Tech Legion", publicMessage: "Eu tive o prazer de trabalhar com Augusto em alguns projetos e posso dizer com confiança que ele é um profissional excepcional. Suas habilidades analíticas e técnicas são impressionantes, além de ser um designer gráfico talentoso e um desenvolvedor excepcional." },
  { key: "camilo-italo", displayName: "Camilo Italo", role: "Desenvolvedor de Software", company: "Tech Legion", publicMessage: "É incrível como tudo que tu faz é meio que um pouco a tua cara, você é um desenvolvedor como poucos." },
  { key: "samir", displayName: "Samir", role: "Desenvolvedor Web Frontend", company: "DRT Sistemas", publicMessage: "Minha primeira experiência com Augusto como desenvolvedor web foi incrível. Ele é altamente habilidoso, mantém uma excelente comunicação no trabalho remoto e é proativo em impulsionar projetos com novas ideias." },
  { key: "warllei", displayName: "Warllei", role: "Desenvolvedor Web Frontend", company: "DRT Sistemas", publicMessage: "É com prazer que recomendo Augusto Westphal como um desenvolvedor Full-Stack altamente competente. Durante nosso tempo juntos na DRT Sistemas, demonstrou domínio em Node.js, React.js e Next.js, entregando projetos de alta qualidade." },
]

const client = new MongoClient(process.env.MONGO_URL)
await client.connect()

try {
  const feedbacks = client.db().collection("feedbacks")
  const now = new Date()
  for (const testimonial of testimonials) {
    await feedbacks.updateOne(
      { seedKey: `static-testimonial:${testimonial.key}` },
      {
        $setOnInsert: {
          seedKey: `static-testimonial:${testimonial.key}`,
          message: testimonial.publicMessage,
          consent: { publishedAt: now, version: "static-editorial-seed-v1" },
          status: "published",
          editorial: {
            displayName: testimonial.displayName,
            role: testimonial.role,
            company: testimonial.company,
            publicMessage: testimonial.publicMessage,
          },
          submittedAt: now,
          reviewedAt: now,
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    )
  }
  console.log("5 depoimentos estáticos foram verificados no banco.")
} finally {
  await client.close()
}
