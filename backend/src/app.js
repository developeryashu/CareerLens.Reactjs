const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const { errorHandler } = require("./middleware/error-handler")

const app = express()
const allowVercelPreviews = process.env.ALLOW_VERCEL_PREVIEWS === "true"
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean)

function isAllowedOrigin(origin) {
  const normalizedOrigin = origin.replace(/\/$/, "")
  if (allowedOrigins.includes(normalizedOrigin)) {
    return true
  }

  if (allowVercelPreviews && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin)) {
    return true
  }

  return false
}

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests and health checks with no Origin header.
      if (!origin) {
        return callback(null, true)
      }

      if (isAllowedOrigin(origin)) {
        return callback(null, true)
      }

      return callback(new Error("CORS origin not allowed"))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" })
})

app.use("/api/auth", authRoutes)
app.use(errorHandler)

module.exports = app
