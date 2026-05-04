import { Types } from "mongoose"
import CustomError from "../errorHandler/CustomError"
import { IWorkspace } from "../interfaces/IWorkspace"
import workspaceModel from "../models/workspace.model"

class workspaceRepo {
  public async create(
    ownerId: Types.ObjectId | string,
    data: IWorkspace.create,
  ) {
    const workspace = await workspaceModel.create({
      name: data.name,
      ownerId: ownerId,
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
      return await workspace
    })
  }
  public async delete(data: IWorkspace.remove) {
    let workspace = await workspaceModel.findOne({
      _id: data.workspaceId,
      ownerId: data.ownerId,
      isDeleted: false,
    })
    if (!workspace) throw new CustomError("workspace not found", 404)
    workspace.isDeleted = true
    await workspace.save()
    return true
  }
  public async query(data: IWorkspace.query) {
    const { page = 1, limit = 10 } = data
    let _query: Record<string, any> = { isDeleted: false }
    if (data.name) _query.name = data.name
    if (data.ownerId) _query.ownerId = new Types.ObjectId(data.ownerId)
    if (data.workspaceId) _query._id = new Types.ObjectId(data.workspaceId)
    const workspaces = await workspaceModel
      .find(_query)
      .populate("ownerId")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
    const count = await workspaceModel.countDocuments(_query)
    return { workspaces, count }
  }
}
export default new workspaceRepo()
