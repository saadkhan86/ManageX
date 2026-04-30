import CustomError from "../errorHandler/CustomError"
import { IWorkspace } from "../interfaces/IWorkspace"
import userModel from "../models/user.model"
import workspaceModel from "../models/workspace.model"

class workspaceRepo {
  public async create(data: IWorkspace.create) {
    const workspace = await workspaceModel.create({
      name: data.name,
      ownerId: data.ownerId,
      description: data.description,
    })
    return workspace
  }
  public async update(data: IWorkspace.update) {
    let workspace = await workspaceModel.findOne({
      _id: data.workspaceId,
      ownerId: data.ownerId,
      isDeleted: false,
    })
    if (!workspace) throw new CustomError("workspace not found", 404)
    if (data.name) workspace.name = data.name
    if (data.description) workspace.description = data.description
    return await workspace.save().then(async (workspace) => {
      return await workspace.populate("ownerId")
    })
  }
  public async delete(data: IWorkspace.remove) {
    let workspace = await workspaceModel.findOne({
      _id: data.workspaceId,
      isDeleted: false,
    })
    if (!workspace) throw new CustomError("workspace not found", 404)
    if (data.ownerId !== workspace.ownerId)
      throw new CustomError("you are not a owner of this workspace", 401)
    workspace.isDeleted = true
    await workspace.save()
    return true
  }
  public async query(data: IWorkspace.query) {
    const { page = 1, limit = 10 } = data
    let _query: Record<string, any> = {}
    if (data.name) _query.name = data.name
    if (data.ownerId) _query.ownerId = data.ownerId
    if (data.workspaceId) _query.workspaceId
    _query.isDeleted = false
    const workspaces = await workspaceModel
      .find(_query)
      .populate("ownerId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
    const count = await userModel.countDocuments(_query)
    return { workspaces, count }
  }
}
export default new workspaceRepo()
