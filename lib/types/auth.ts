export interface AuthUser {
  id: string
  email: string
}

export interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
}

export interface SessionData {
  user: AuthUser | null
  profile: UserProfile | null
}
