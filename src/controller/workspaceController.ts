import { NextFunction, Request, Response } from "express"
import workspaceRepo from "../repositories/workspaceRepo"
import { IWorkspace } from "../interfaces/IWorkspace"
import { Types } from "mongoose"

const workspaceController = {
  create: async (req: Request, res: Response, next: Function) => {
    try {
      const workspace = await workspaceRepo.create(
        req.body as IWorkspace.create,
      )
      res.status(201).json({
        success: true,
        message: "workspace created successfully",
        workspace,
      })
    } catch (error) {
      next(error)
    }
  },
  update: async (req: Request, res: Response, next: Function) => {
    try {
      const workspace = await workspaceRepo.update(req.body)
      res.status(200).json({
        success: true,
        message: "workspace updated successfully",
        workspace,
      })
    } catch (error) {
      next(error)
    }
  },
  delete: async (req: Request, res: Response, next: Function) => {
    try {
      const workspace = await workspaceRepo.delete({
        ownerId: req.user._id,
        workspaceId: req.params.id as string,
      })
      res
        .status(200)
        .json({ success: true, message: "workspace deleted successfully" })
    } catch (error) {
      next(error)
    }
  },
  query: async (req: Request, res: Response, next: Function) => {
    try {
      const data = await workspaceRepo.query(req.query as IWorkspace.query)
      res.status(200).json({
        success: true,
        message: "workspace fetched successfully",
        AudioData,
      })
    } catch (error) {
      next(error)
    }
  },
}
export default workspaceController
