const express = require("express")
const {
  signUp,
  signIn,
  getCurrentUser,
  signOut,
} = require("../controllers/auth.controller")
const { requireAuth } = require("../middleware/auth")

const router = express.Router()

router.post("/signup", signUp)
router.post("/login", signIn)
router.post("/logout", signOut)
router.get("/me", requireAuth, getCurrentUser)

module.exports = router
