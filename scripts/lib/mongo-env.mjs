export const getMongoUrl = (environment = process.env) => {
  const isProduction = environment.NODE_ENV === "production"
  const url = isProduction
    ? environment.MONGO_URL
    : environment.MONGO_URL_DEV || environment.MONGO_URL

  if (!url) {
    throw new Error(isProduction
      ? "MONGO_URL is required"
      : "MONGO_URL_DEV or MONGO_URL is required")
  }

  return url
}
