import mongoose from "mongoose"
import { IInvite } from "../interfaces/IInvite"
const inviteSchema = new mongoose.Schema<IInvite.Doc>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "workspace Id required"],
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["manager", "member"],
      default: "member",
    },
    token: {
      type: String,
      required: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      required: true,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)
inviteSchema.virtual("isExist").get(function () {
  return !this.isDeleted
})
export default mongoose.model<IInvite.Doc>("Invite", inviteSchema)
