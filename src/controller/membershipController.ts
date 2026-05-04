import { NextFunction, Request, Response } from "express"
import membershipRepo from "../repositories/membershipRepo"
import { IMembership } from "../interfaces/IMembership"
import { Types } from "mongoose"

const membershipController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const membership = await membershipRepo.create({
        userId: req.user!._id as Types.ObjectId,
        workspaceId: req.body.workspaceId,
        role: "admin",
      })

      res.status(201).json({
        success: true,
        message: "membership created successfully",
        membership,
      })
    } catch (error) {
      next(error)
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const membership = await membershipRepo.update({
        userId: req.user!._id,
        membershipId: req.params.id as string,
        role: req.body.role,
      })

      res.status(200).json({
        success: true,
        message: "membership updated successfully",
        membership,
      })
    } catch (error) {
      next(error)
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await membershipRepo.delete({
        userId: req.user!._id,
        membershipId: req.params.id as string,
      })

      res.status(200).json({
        success: true,
        message: "membership deleted successfully",
      })
    } catch (error) {
      next(error)
    }
  },

  query: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await membershipRepo.query(req.query as IMembership.query)

      res.status(200).json({
        success: true,
        message: "membership fetched successfully",
        data,
      })
    } catch (error) {
      next(error)
    }
  },
}

export default membershipController
