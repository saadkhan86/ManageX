import CustomError from "../errorHandler/CustomError"
import { IInvite } from "../interfaces/IInvite"
import inviteModel from "../models/invite.model"
import { tokenUtils } from "../utils/tokenUtils"

class inviteRepo {
  public async create(data: IInvite.create) {
    data.token = tokenUtils.genToken(32)
    const invite = await inviteModel.create(data as IInvite.create)
    return invite
  }
  public async update(token: string, isAccepted: "accepted" | "rejected") {
    let invite = await inviteModel.findOne({ token, isDeleted: false })
    if (!invite) throw new CustomError("Invite Not Found", 404)
    if (
      invite.expiresAt === null ||
      Math.floor(invite.expiresAt.getTime() / 1000) < Date.now()
    )
      throw new CustomError("Expired token", 401)
    if (invite.status === "accepted")
      throw new CustomError("Invite already accepted", 200)
    if (isAccepted === "accepted") invite.status = "accepted"
    if (isAccepted === "rejected") invite.status = "rejected"
    invite.expiresAt = null
    return await invite.save()
  }
  public async delete(data: IInvite.remove) {
    let invite = await inviteModel.findOne({
      _id: data.inviteId,
      userId: data.invitedBy,
      isDeleted: false,
    })
    if (!invite) throw new CustomError("invite not found", 404)
    invite.isDeleted = true
    return await invite.save()
  }
  public async query(data: IInvite.query) {
    const { limit = 10, page = 1 } = data
    let _query: Record<string, any> = {}
    if (data.email) _query.email = data.email
    if (data.inviteId) _query.inviteId = data.inviteId
    if (data.invitedBy) _query.invitedBy = data.invitedBy
    if (data.role) _query.role = data.role
    if (data.status) _query.status = data.status
    if (data.workspaceId) _query.workspaceId = data.workspaceId
    _query.isDeleted = false
    const invites = await inviteModel
      .find(_query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .populate("invitedBy")
    const count = await inviteModel.countDocuments(_query)
    return { invites, count }
  }
}
export default new inviteRepo()
