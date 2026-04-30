import mongoose, { Types } from "mongoose"

export declare namespace IMembership {
  interface create {
    userId: Types.ObjectId | string
    workspaceId: Types.ObjectId | string
    role: "admin" | "manager" | "member"
    joinedAt: Date
    isDeleted: boolean
  }
  interface Doc extends create, Document {}
  interface update {
    membershipId: Types.ObjectId | string
    userId: Types.ObjectId | string
    role?: "admin" | "manager" | "member"
  }
  interface remove {
    userId: Types.ObjectId | string
    membershipId: Types.ObjectId | string
  }
  interface query {
    membershipId?: Types.ObjectId | string
    userId?: Types.ObjectId | string
    workspaceId?: Types.ObjectId | string
    role?: "admin" | "manager" | "member"
    limit?: number
    page?: number
  }
}
