const User = require("../models/User")
const { verifyAccessToken } = require("../utils/token")

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.access_token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const payload = verifyAccessToken(token)
    const user = await User.findById(payload.userId).select("-passwordHash")
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    req.user = user
    return next()
  } catch (_error) {
    return res.status(401).json({ message: "Unauthorized" })
  }
}

module.exports = {
  requireAuth,
}
