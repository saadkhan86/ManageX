import { Request, Response, NextFunction } from "express"
import membershipModel from "../models/membership.model"
import CustomError from "../errorHandler/CustomError"

export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id

      let workspaceId =
        req.body.workspaceId || req.params.workspaceId || req.query.workspaceId

      if (!workspaceId && req.params.id) {
        const targetMembership = await membershipModel.findById(req.params.id)
        if (targetMembership) {
          workspaceId = targetMembership.workspaceId
        }
      }

      if (!userId || !workspaceId) {
        throw new CustomError("User or workspaceId missing", 400)
      }

      const membership = await membershipModel.findOne({
        userId,
        workspaceId,
        isDeleted: false,
      })

      if (!membership) {
        throw new CustomError("Not a member of this workspace", 403)
      }

      if (!allowedRoles.includes(membership.role)) {
        throw new CustomError("Access denied, Only allowed" + allowedRoles, 403)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
