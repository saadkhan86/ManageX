import mongoose, { Types } from "mongoose"

export declare namespace IInvite {
  interface create {
    email: string
    workspaceId: Types.ObjectId | string
    invitedBy: Types.ObjectId | string
    role: "manager" | "member"
    token: string
    status: "pending" | "accepted" | "rejected" | "expired"
    expiresAt: Date | null
  }
  interface Doc extends create, Document {
    isDeleted: boolean
  }
  interface update {
    inviteId: Types.ObjectId | string
    email?: string
    workspaceId?: Types.ObjectId | string
    invitedBy?: Types.ObjectId | string
    role?: "manager" | "member"
    token?: string
    status?: "pending" | "accepted" | "rejected" | "expired"
    expiresAt?: Date
  }
  interface remove {
    inviteId: Types.ObjectId | string
    invitedBy: Types.ObjectId | string
  }
  interface query {
    inviteId?: Types.ObjectId | string
    email?: string
    workspaceId?: Types.ObjectId | string
    invitedBy?: Types.ObjectId | string
    role?: "manager" | "member"
    status?: "pending" | "accepted" | "rejected" | "expired"
    limit?: number
    page?: number
  }
}
