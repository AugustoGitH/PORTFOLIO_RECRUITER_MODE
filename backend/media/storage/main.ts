import "server-only"
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

const getClient = () => {
  const { R2_ENDPOINT: endpoint, R2_ACCESS_KEY_ID: accessKeyId, R2_SECRET_ACCESS_KEY: secretAccessKey, R2_BUCKET: bucket, R2_PUBLIC_BASE_URL: publicBaseUrl } = process.env
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) throw new Error("R2 media storage is not configured")
  return { bucket, publicBaseUrl, client: new S3Client({ endpoint, region: "auto", credentials: { accessKeyId, secretAccessKey } }) }
}

export const putPublicWebp = async (key: string, body: Buffer) => {
  const { bucket, publicBaseUrl, client } = getClient()
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: "image/webp", CacheControl: "public, max-age=31536000, immutable" }))
  return { bucket, key, publicUrl: `${publicBaseUrl.replace(/\/$/, "")}/${key}` }
}

export const deletePublicObject = async (key: string) => {
  const { bucket, client } = getClient()
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
}
