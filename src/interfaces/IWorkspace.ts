import mongoose, { Types } from "mongoose"

export declare namespace IWorkspace {
  interface create {
    name: string
    ownerId: Types.ObjectId | string
    description: string
  }
  interface Doc extends create, Document {
    isDeleted: boolean
  }
  interface update {
    ownerId: Types.ObjectId | string
    workspaceId: Types.ObjectId | string
    name?: string
    description?: string
  }
  interface remove {
    workspaceId: Types.ObjectId | string
    ownerId: Types.ObjectId | string
  }
  interface query {
    workspaceId?: Types.ObjectId | string
    name?: string
    ownerId?: Types.ObjectId | string
    description?: string
    page?: number
    limit?: number
  }
}
