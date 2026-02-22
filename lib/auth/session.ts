import type { SessionData, AuthUser, UserProfile } from "@/lib/types/auth"

const EMAIL_COOKIE = "cl_email"
const NAME_COOKIE = "cl_name"

function buildUserId(email: string) {
  const hasBuffer = typeof globalThis !== "undefined" && "Buffer" in globalThis
  if (hasBuffer) {
    return `user_${Buffer.from(email).toString("base64url").slice(0, 24)}`
  }

  if (typeof btoa === "function") {
    return `user_${btoa(email).replace(/[+/=]/g, "").slice(0, 24)}`
  }

  return `user_${email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 24)}`
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null
  }

  const token = `${name}=`
  const part = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(token))

  return part ? decodeURIComponent(part.slice(token.length)) : null
}

export async function getSessionFromCookies(): Promise<SessionData> {
  const email = readCookie(EMAIL_COOKIE)
  const fullName = readCookie(NAME_COOKIE)

  if (!email) {
    return { user: null, profile: null }
  }

  const id = buildUserId(email)

  return {
    user: {
      id,
      email,
    },
    profile: {
      id,
      full_name: fullName,
      avatar_url: null,
    },
  }
}

export async function requireSessionUser(): Promise<{ user: AuthUser; profile: UserProfile }> {
  const session = await getSessionFromCookies()

  if (!session.user || !session.profile) {
    throw new Error("Unauthorized")
  }

  return { user: session.user, profile: session.profile }
}
