import CustomError from "../errorHandler/CustomError"
import { IMembership } from "../interfaces/IMembership"
import membershipModel from "../models/membership.model"

class MembershipRepo {
  public async create(data: IMembership.create) {
    const membership = await membershipModel.create({
      userId: data.userId,
      workspaceId: data.workspaceId,
      role: data.role || "member",
      joinedAt: new Date(),
      isDeleted: false,
    })
    return membership
  }

  public async update(data: IMembership.update) {
    const membership = await membershipModel.findOneAndUpdate(
      { _id: data.membershipId, isDeleted: false },
      { role: data.role },
      { new: true },
    )

    if (!membership) throw new CustomError("Membership not found", 404)

    return membership
  }

  public async delete(data: IMembership.remove) {
    const membership = await membershipModel.findOneAndUpdate(
      { _id: data.membershipId, isDeleted: false },
      { isDeleted: true },
      { new: true },
    )

    if (!membership) throw new CustomError("Membership not found", 404)

    return true
  }

  public async query(data: IMembership.query) {
    const { limit = 10, page = 1 } = data

    let _query: Record<string, any> = {
      isDeleted: false,
    }

    if (data.membershipId) _query._id = data.membershipId
    if (data.role) _query.role = data.role
    if (data.userId) _query.userId = data.userId
    if (data.workspaceId) _query.workspaceId = data.workspaceId

    const memberships = await membershipModel
      .find(_query)
      .populate("userId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const count = await membershipModel.countDocuments(_query)

    return { memberships, count }
  }
}

export default new MembershipRepo()
