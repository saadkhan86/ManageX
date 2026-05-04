import mongoose from "mongoose"
const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: [2, "workspace name must be greater than 2 characters"],
      maxLength: [30, "workspace must be less than 30 characters"],
      required: true,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "owner required for creating workspace"],
    },
    description: {
      type: String,
      required: [true, "description is required for creating workspace"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Workspace", workspaceSchema)
