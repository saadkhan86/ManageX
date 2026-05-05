import CustomError from "../errorHandler/CustomError"
import { IInvite } from "../interfaces/IInvite"
import inviteModel from "../models/invite.model"
import { tokenUtils } from "../utils/tokenUtils"
import userRepo from "./userRepo"

class inviteRepo {
  public async create(data: IInvite.create) {
    const token = tokenUtils.genTokenForVerification(32)
    const invite = await inviteModel.create({
      email: data.email,
      workspaceId: data.workspaceId,
      invitedBy: data.invitedBy,
      role: data.role,
      token,
      status: "pending",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })
    return invite
  }
  public async update(token: string, isAccepted: "accepted" | "rejected") {
    let invite = await inviteModel.findOne({ token, isDeleted: false })
    if (!invite) throw new CustomError("Invite Not Found", 404)
    if (
      invite.expiresAt === null ||
      Math.floor(invite.expiresAt.getTime()) < Date.now()
    )
      throw new CustomError(
        "Either token expired or invite has been expired",
        401,
      )
    const user = await userRepo.query({ email: invite?.email })
    if (user.user.length === 0 || user.count === 0) {
      throw new CustomError(
        "User not found signup please to accept invitation",
        404,
      )
    }
    if (invite.status === "accepted")
      throw new CustomError("Invite already accepted", 200)
    if (invite.status === "rejected")
      throw new CustomError("Invite already rejected", 200)
    if (isAccepted == "accepted") invite.status = "accepted"
    if (isAccepted == "rejected") invite.status = "rejected"
    invite.expiresAt = null
    invite = await invite.save()
    return { invite, userId: user.user[0]._id }
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
    let _query: Record<string, any> = { isDeleted: false }
    if (data.email) _query.email = data.email
    if (data.inviteId) _query.inviteId = data.inviteId
    if (data.invitedBy) _query.invitedBy = data.invitedBy
    if (data.role) _query.role = data.role
    if (data.status) _query.status = data.status
    if (data.workspaceId) _query.workspaceId = data.workspaceId
    const invites = await inviteModel
      .find(_query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .populate("invitedBy")
      .lean()
    const count = await inviteModel.countDocuments(_query)
    return { invites, count }
  }
}
export default new inviteRepo()
