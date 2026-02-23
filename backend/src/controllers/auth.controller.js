const bcrypt = require("bcryptjs")
const User = require("../models/User")
const { signAccessToken } = require("../utils/token")

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production"

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
  }
}

function normalizeUser(user) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

function validateSignupInput(fullName, email, password) {
  if (!fullName || !email || !password) {
    return "Full name, email, and password are required."
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters."
  }
  return null
}

function validateLoginInput(email, password) {
  if (!email || !password) {
    return "Email and password are required."
  }
  return null
}

async function signUp(req, res, next) {
  try {
    const { fullName, email, password } = req.body
    const validationError = validateSignupInput(fullName, email, password)
    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
    })

    const token = signAccessToken(user._id.toString())
    res.cookie("access_token", token, getCookieOptions())

    return res.status(201).json({
      message: "Account created successfully.",
      user: normalizeUser(user),
    })
  } catch (error) {
    return next(error)
  }
}

async function signIn(req, res, next) {
  try {
    const { email, password } = req.body
    const validationError = validateLoginInput(email, password)
    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." })
    }

    const token = signAccessToken(user._id.toString())
    res.cookie("access_token", token, getCookieOptions())

    return res.status(200).json({
      message: "Signed in successfully.",
      user: normalizeUser(user),
    })
  } catch (error) {
    return next(error)
  }
}

async function getCurrentUser(req, res) {
  return res.status(200).json({
    user: normalizeUser(req.user),
  })
}

async function signOut(req, res) {
  const cookieOptions = getCookieOptions()
  res.clearCookie("access_token", {
    ...cookieOptions,
    maxAge: undefined,
    expires: new Date(0),
  })
  return res.status(200).json({ message: "Signed out successfully." })
}

module.exports = {
  signUp,
  signIn,
  getCurrentUser,
  signOut,
}
