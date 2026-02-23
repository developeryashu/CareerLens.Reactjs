const dotenv = require("dotenv")

dotenv.config()

const app = require("./app")
const { connectDb } = require("./config/db")
const { validateEnv } = require("./config/env")

const port = Number(process.env.PORT || 5000)

async function startServer() {
  validateEnv()
  await connectDb()

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error("Failed to start backend:", error.message)
  process.exit(1)
})
