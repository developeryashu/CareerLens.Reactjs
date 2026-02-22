import type { SessionData } from "@/lib/types/auth"

const EMAIL_COOKIE = "cl_email"
const NAME_COOKIE = "cl_name"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
}

function readCookie(name: string) {
  const token = `${name}=`
  const part = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(token))

  return part ? decodeURIComponent(part.slice(token.length)) : null
}

function buildUserId(email: string) {
  return `user_${btoa(email).replace(/[+/=]/g, "").slice(0, 24)}`
}

export async function signInWithPassword(email: string, password: string) {
  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  setCookie(EMAIL_COOKIE, email)
  return { error: null as string | null }
}

export async function signUpWithPassword(fullName: string, email: string, password: string) {
  if (!fullName || !email || !password) {
    return { error: "Full name, email, and password are required." }
  }

  setCookie(EMAIL_COOKIE, email)
  setCookie(NAME_COOKIE, fullName)
  return { error: null as string | null }
}

export async function signOut() {
  clearCookie(EMAIL_COOKIE)
  clearCookie(NAME_COOKIE)
}

export async function getClientSession(): Promise<SessionData> {
  const email = readCookie(EMAIL_COOKIE)
  const fullName = readCookie(NAME_COOKIE)

  if (!email) {
    return { user: null, profile: null }
  }

  const id = buildUserId(email)
  return {
    user: { id, email },
    profile: { id, full_name: fullName, avatar_url: null },
  }
}

export async function saveProfileName(fullName: string) {
  setCookie(NAME_COOKIE, fullName)
}
