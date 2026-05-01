import mongoose from "mongoose"
const membershipSchema = new mongoose.Schema(
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
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Membership", membershipSchema)
