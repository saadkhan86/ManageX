import { NextFunction, Request, Response } from "express"
import { Types } from "mongoose"
import { ITask } from "../interfaces/ITask"
import membershipRepo from "../repositories/membershipRepo"
import taskRepo from "../repositories/taskRepo"

const taskController = {
  create: async (req: Request, res: Response, next: Function) => {
    try {
      let membership = await membershipRepo.query({
        userId: req.user?._id,
        workspaceId: req.body.workspaceId,
      })
      if (!membership.memberships || membership.count === 0) {
        return res
          .status(404)
          .json({ success: false, message: "not a member of this workspace" })
      }
      if (!["admin", "manager"].includes(membership.memberships[0].role)) {
        return res
          .status(403)
          .json({ success: false, message: "not authorized to create task" })
      }
      membership = await membershipRepo.query({
        userId: req.body.assignedTo,
        workspaceId: req.body.workspaceId,
      })
      if (!membership.memberships || membership.count == 0) {
        return res.status(400).json({
          success: false,
          message: "assigned user is not in workspace",
        })
      }
      const task = await taskRepo.create({
        title: req.body.title,
        description: req.body.description,
        workspaceId: req.body.workspaceId as Types.ObjectId,
        createdBy: req.user?._id as Types.ObjectId,
        assignedTo: req.body.assignedTo as Types.ObjectId,
        status: req.body.status || "todo",
        priority: req.body.priority || "low",
        dueDate: req.body.dueDate || null,
      })
      return res.status(200).json({
        success: true,
        message: "task created successfully",
        data: task,
      })
    } catch (error) {
      next(error)
    }
  },
  update: async (req: Request, res: Response, next: Function) => {
    try {
      const { tasks } = await taskRepo.query({
        taskId: req.params.id as string,
      })
      if (!tasks || tasks.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found" })
      }
      const task: any = tasks[0]
      const permission = await membershipRepo.query({
        userId: req.user?._id,
        workspaceId: task.workspaceId?._id,
      })
      if (!permission.memberships || permission.count === 0) {
        return res
          .status(404)
          .json({ success: false, message: "not a member of this workspace" })
      }
      const role = permission.memberships[0].role
      const userId = req.user?._id?.toString()
      let updateData: any = { taskId: req.params.id as string }
      if (task.assignedTo?._id.toString() === userId) {
        if (!req.body.status) {
          return res.status(400).json({
            success: false,
            message: "you can only change status of task",
          })
        }
        updateData.status = req.body.status
      } else if (["admin", "manager"].includes(role)) {
        if (req.body.title) {
          updateData.title = req.body.title
        }
        if (req.body.description) {
          updateData.description = req.body.description
        }
        if (req.body.status) {
          updateData.status = req.body.status
        }
        if (req.body.priority) {
          updateData.priority = req.body.priority
        }
        if (req.body.dueDate) {
          updateData.dueDate = req.body.dueDate
        }
        if (req.body.assignedTo) {
          if (role !== "admin") {
            return res
              .status(403)
              .json({ success: false, message: "only admin can reassign task" })
          }
          updateData.assignedTo = req.body.assignedTo as Types.ObjectId
        }
      } else {
        return res.status(403).json({
          success: false,
          message: "you are not authorized to update this task",
        })
      }
      const updateTask = await taskRepo.update(updateData)
      return res.status(200).json({
        success: true,
        message: "task updated successfully",
        data: updateTask,
      })
    } catch (error) {
      next(error)
    }
  },
  delete: async (req: Request, res: Response, next: Function) => {
    try {
      let task = await taskRepo.query({
        taskId: req.params.id as string,
      })
      if (!task.tasks || task.tasks.length === 0) {
        return res.status(404).json({
          success: false,
          message: "task not found",
        })
      }
      const permission = await membershipRepo.query({
        userId: req.user?._id,
        workspaceId: task.tasks[0].workspaceId as string,
      })
      if (!permission.memberships || permission.count === 0) {
        return res
          .status(404)
          .json({ success: false, message: "not a member of this workspace" })
      }
      if (!["admin", "manager"].includes(permission.memberships[0].role)) {
        return res
          .status(403)
          .json({ success: false, message: "not authorized to delete task" })
      }
      await taskRepo.delete({
        taskId: req.params.id as string,
        createdBy: req.user?._id as Types.ObjectId,
      })
      return res.status(200).json({
        success: true,
        message: "task deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  },
  query: async (req: Request, res: Response, next: Function) => {
    try {
      const tasks = await taskRepo.query(req.query as ITask.query)
      return res.status(200).json({
        success: true,
        message: "tasks fetched successfully",
        data: tasks,
      })
    } catch (error) {
      next(error)
    }
  },
}
export default taskController
