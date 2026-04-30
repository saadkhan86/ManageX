import { NextFunction, Request, Response } from "express"
import membershipRepo from "../repositories/membershipRepo"
import { IMembership } from "../interfaces/IMembership"

const membershipController = {
  create: async (req: Request, res: Response, next: Function) => {
    try {
      const membership = await membershipRepo.create(
        req.body as IMembership.create,
      )
      res.status(201).json({
        success: true,
        message: "membership created successfully",
        membership,
      })
    } catch (error) {
      next(error)
    }
  },
  update: async (req: Request, res: Response, next: Function) => {
    try {
      let membership = await membershipRepo.update(
        req.body as IMembership.update,
      )
      res.status(200).json({
        success: true,
        message: "membership updated successfully",
        membership,
      })
    } catch (error) {
      next(error)
    }
  },
  delete: async (req: Request, res: Response, next: Function) => {
    try {
      const membership = await membershipRepo.delete(
        req.params as unknown as IMembership.remove,
      )
      res
        .status(200)
        .json({ success: true, message: "membership deleted successfully" })
    } catch (error) {
      next(error)
    }
  },
  query: async (req: Request, res: Response, next: Function) => {
    try {
      const data = await membershipRepo.query(req.query as IMembership.query)
      res
        .status(200)
        .json({
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
