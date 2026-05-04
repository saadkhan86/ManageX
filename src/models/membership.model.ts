import mongoose from "mongoose"
import { IMembership } from "../interfaces/IMembership"
const membershipSchema = new mongoose.Schema<IMembership.Doc>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId required"],
    },
    workspaceId: {
      type: mongoose.Types.ObjectId,
      ref: "Workspace",
      required: [true, "workspaceId required"],
    },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "admin",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true },
)
membershipSchema.index(
  { userId: 1, workspaceId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
)
export default mongoose.model<IMembership.Doc>("Membership", membershipSchema)
