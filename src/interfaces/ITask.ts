import mongoose, { mongo, Types } from "mongoose"

export declare namespace ITask {
  interface create {
    title: string
    description: string
    workspaceId: Types.ObjectId | string
    createdBy: Types.ObjectId | string
    assignedTo: Types.ObjectId | string
    status: "todo" | "in_progress" | "done"
    priority: "low" | "medium" | "high"
    dueDate: Date
  }
  interface Doc extends create, Document {
    isDeleted: boolean
  }
  interface update {
    taskId: Types.ObjectId | string
    workspaceId: Types.ObjectId | string
    createdBy: Types.ObjectId | string
    assignedTo: Types.ObjectId | string
    title?: string
    description?: string
    status?: "todo" | "in_progress" | "done"
    priority?: "low" | "medium" | "high"
    dueDate?: Date
  }
  interface remove {
    taskId: Types.ObjectId | string
    createdBy: Types.ObjectId | string
  }
  interface query {
    taskId?: Types.ObjectId | string
    title?: string
    workspaceId?: Types.ObjectId | string
    createdBy?: Types.ObjectId | string
    assignedTo?: Types.ObjectId | string
    status?: "todo" | "in_progress" | "done"
    priority?: "low" | "medium" | "high"
    dueDate?: Date
    page?: number
    limit?: number
  }
}
