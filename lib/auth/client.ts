import type { SessionData } from "@/lib/types/auth"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000"

interface ApiUser {
  id: string
  fullName: string
  email: string
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  })

  const data = (await response.json().catch(() => ({}))) as { message?: string } & T
  if (!response.ok) {
    throw new Error(data.message || "Request failed")
  }

  return data
}

export async function signInWithPassword(email: string, password: string) {
  try {
    await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return { error: null as string | null }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Login failed." }
  }
}

export async function signUpWithPassword(fullName: string, email: string, password: string) {
  try {
    await apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password }),
    })
    return { error: null as string | null }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Signup failed." }
  }
}

export async function signOut() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" })
  } catch {
    // Ignore logout failures on client side to keep UX resilient.
  }
}

export async function getClientSession(): Promise<SessionData> {
  try {
    const data = await apiRequest<{ user: ApiUser }>("/api/auth/me")
    const user = data.user

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      profile: {
        id: user.id,
        full_name: user.fullName ?? null,
        avatar_url: null,
      },
    }
  } catch {
    return { user: null, profile: null }
  }
}

export async function saveProfileName(fullName: string) {
  return fullName
}
