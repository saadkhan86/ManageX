import CustomError from "../errorHandler/CustomError"
import { IMembership } from "../interfaces/IMembership"
import membershipModel from "../models/membership.model"

class membershipRepo {
  public async create(data: IMembership.create) {
    const membership = await membershipModel.create({
      userId: data.userId,
      workspaceId: data.workspaceId,
      role: "admin",
      joinedAt: new Date(Date.now()),
    })
    return membership
  }
  public async update(data: IMembership.update) {
    let membership = await membershipModel.findOne({
      userId: data.userId,
      _id: data.membershipId,
      isDeleted: false,
    })
    if (!membership) throw new CustomError("membership not found", 404)
    if (data.role) membership.role = data.role
    return await membership.save()
  }
  public async delete(data: IMembership.remove) {
    let membership = await membershipModel.findOne({
      _id: data.membershipId,
      userId: data.userId,
      isDeleted: false,
    })
    if (!membership) return false
    membership.isDeleted = true
    await membership.save()
    return true
  }
  public async query(data: IMembership.query) {
    const { limit = 10, page = 1 } = data
    let _query: Record<string, any> = {}
    if (data.membershipId) _query.membershipId = data.membershipId
    if (data.role) _query.role = data.role
    if (data.userId) _query.userId = data.userId
    if (data.workspaceId) _query.workspaceId = data.workspaceId
    _query.isDeleted = false
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

export default new membershipRepo()
