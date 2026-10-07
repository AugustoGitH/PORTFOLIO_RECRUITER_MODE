import nextEnv from "@next/env"

nextEnv.loadEnvConfig(process.cwd())

export const getEnvironmentName = (environment = process.env) =>
  environment.ENVIRONMENT?.trim().toLowerCase()
  || (environment.NODE_ENV === "production" ? "production" : "development")

export const getMongoUrl = (environment = process.env) => {
  const isDevelopment = getEnvironmentName(environment) === "development"
  const url = isDevelopment
    ? environment.MONGO_URL_DEV || environment.MONGO_URL
    : environment.MONGO_URL

  if (!url) {
    throw new Error(isDevelopment
      ? "MONGO_URL_DEV or MONGO_URL is required"
      : "MONGO_URL is required")
  }

  return url
}
