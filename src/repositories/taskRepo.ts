import { ITask } from "../interfaces/ITask"
import taskModel from "../models/task.model"

class taskRepo {
  public async create(data: ITask.create) {
    const task = await taskModel.create({
      title: data.title,
      description: data.description,
      workspaceId: data.workspaceId,
      createdBy: data.createdBy,
      assignedTo: data.assignedTo,
      status: data.status || "todo",
      priority: data.priority || "low",
      dueDate: data.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isDeleted: false,
    })
    return task
  }
  public async update(data: ITask.update) {
    const { taskId, ...updateData } = data
    const task = await taskModel.findOneAndUpdate(
      { _id: taskId, isDeleted: false },
      { $set: updateData },
      { new: true },
    )
    return task
  }
  public async delete(data: ITask.remove) {
    const task = await taskModel.findOneAndUpdate(
      { _id: data.taskId, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true },
    )
    return task
  }
  public async query(data: ITask.query) {
    const { limit = 10, page = 1 } = data
    let _query: Record<string, any> = {
      isDeleted: false,
    }
    if (data.workspaceId) _query.workspaceId = data.workspaceId
    if (data.title) _query.title = { $regex: data.title, $options: "i" }
    if (data.createdBy) _query.createdBy = data.createdBy
    if (data.assignedTo) _query.assignedTo = data.assignedTo
    if (data.status) _query.status = data.status
    if (data.priority) _query.priority = data.priority
    if (data.taskId) _query._id = data.taskId
    const tasks = await taskModel
      .find(_query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate([
        { path: "workspaceId", select: "name" },
        { path: "createdBy", select: "name" },
        { path: "assignedTo", select: "name" },
      ])
      .lean()
    const count = await taskModel.countDocuments(_query)
    return { tasks, count }
  }
}
export default new taskRepo()
