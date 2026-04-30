import mongoose from "mongoose"

export declare namespace IUser {
  interface Doc {
    name: string
    email: string
    username: string
    passwordHash: string
    isEmailVerified: boolean
    emailVerificationToken: string | null
    emailVerificationTokenExpires: Date | null
    passwordResetToken: string | null
    passwordResetExpires: Date | null
    refreshToken: string | null
    avatarUrl: string | null
    phoneNumber: string
    bio: string
    country: string
    timezone: string
    provider: "local" | "google" | "github"
    providerId: string
    isActive: boolean
    isBlocked: boolean
    failedLoginAttempts: number
    lockedUntil: Date
    lastLoginAt: Date
    lastSeenAt: Date
    loginCount: number
    comparePassword(password: string): Promise<boolean>
  }

  interface signup {
    name: string
    email: string
    username: string
    password: string
  }

  interface oAuthCreate {
    name: string
    email: string
    provider: "google" | "github"
    providerId: string
    avatarUrl: string
  }
  interface login {
    email: string
    password: string
  }

  interface update {
    userId: mongoose.Schema.Types.ObjectId | string
    name?: string
    phoneNumber?: string
    bio?: string
    country?: string
    timezone?: string
  }

  interface remove {
    userId: mongoose.Schema.Types.ObjectId | string
  }

  interface query {
    userId?: mongoose.Schema.Types.ObjectId | string
    name?: string
    email?: string
    username?: string
    limit?: number
    page?: number
  }
}
