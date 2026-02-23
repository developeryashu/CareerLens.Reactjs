const requiredVars = ["MONGODB_URI", "JWT_SECRET", "CLIENT_URL"]

function validateEnv() {
  const missing = requiredVars.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

module.exports = {
  validateEnv,
}
