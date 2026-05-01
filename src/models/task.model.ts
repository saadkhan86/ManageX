import mongoose from "mongoose"
import { ITask } from "../interfaces/ITask"
const taskSchema = new mongoose.Schema<ITask.Doc>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "task title required"],
    },
    description: {
      type: String,
      default: "",
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "workspaceId required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user required who's creating a task"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<ITask.Doc>("Task", taskSchema)
