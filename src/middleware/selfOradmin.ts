import { Request, Response, NextFunction } from "express"
import membershipModel from "../models/membership.model"
import CustomError from "../errorHandler/CustomError"

export const selfOrAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id
    const membershipId = req.params.id

    const targetMembership = await membershipModel.findById(membershipId)

    if (!targetMembership) {
      throw new CustomError("Membership not found", 404)
    }

    const currentMembership = await membershipModel.findOne({
      userId,
      workspaceId: targetMembership.workspaceId,
      isDeleted: false,
    })

    if (!currentMembership) {
      throw new CustomError("Not a member", 403)
    }

    // allow self
    if (targetMembership.userId.toString() === userId?.toString()) {
      return next()
    }

    // allow admin
    if (currentMembership.role === "admin") {
      return next()
    }

    throw new CustomError("Access denied", 403)
  } catch (err) {
    next(err)
  }
}
