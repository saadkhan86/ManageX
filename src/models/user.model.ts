import mongoose, { Error } from "mongoose"
import bcrypt from "bcrypt"
import { IUser } from "../interfaces/IUser"
const userSchema = new mongoose.Schema<IUser.Doc>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "User name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      required: [true, "User email is required"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      sparse: true,
      default: null,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },

    passwordHash: {
      type: String,
      default: null,
      select: false,
      required: [true, "Password is required"],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationTokenExpires: {
      type: Date,
      default: null,
      select: false,
    },

    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    avatarUrl: {
      type: String,
      default: null,
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: null,
      match: [/^\+?\d{10,15}$/, "Please provide a valid phone number"],
    },

    bio: {
      type: String,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      default: null,
    },

    country: {
      type: String,
      trim: true,
      default: null,
    },

    timezone: {
      type: String,
      default: "UTC",
    },

    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
      required: true,
    },

    providerId: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
      select: false,
    },

    blockedAt: {
      type: Date,
      default: null,
      select: false,
    },

    loginCount: {
      type: Number,
      default: 1,
      min: 0,
      select: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0,
      select: false,
    },

    lockedUntil: {
      type: Date,
      default: null,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
      select: false,
    },

    lastSeenAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.virtual("isLocked").get(function () {
  return !!(this.lockedUntil && this.lockedUntil.getTime() > Date.now())
})
userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return
  const salt = await bcrypt.genSalt(5)
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
})
userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash)
}
export default mongoose.model<IUser.Doc>("User", userSchema)
