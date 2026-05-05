import { NextFunction, Request, Response } from "express"
import inviteRepo from "../repositories/inviteRepo"
import workspaceRepo from "../repositories/workspaceRepo"
import { IInvite } from "../interfaces/IInvite"
import emailUtils from "../utils/emailUtils"
import { Types } from "mongoose"
import membershipRepo from "../repositories/membershipRepo"

const inviteController = {
  create: async (req: Request, res: Response, next: Function) => {
    try {
      const workspace = await workspaceRepo.query({
        workspaceId: req.body.workspaceId,
      })
      if (!workspace.workspaces.length) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        })
      }
      if (
        workspace.workspaces[0].ownerId._id.toString() !==
        req.user?._id.toString()
      ) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to create invites in this workspace",
        })
      }
      const invite = await inviteRepo.create({
        email: req.body.email,
        workspaceId: req.body.workspaceId,
        invitedBy: req.user?._id as Types.ObjectId,
        role: req.body.role,
        token: null,
        status: "pending",
        expiresAt: null,
      })
      const { workspaces } = await workspaceRepo.query({
        workspaceId: req.body.workspaceId,
      })
      const workspaceName = workspaces[0]?.name || "Workspace"

      emailUtils
        .sendInviteEmail(
          req.user?.name as string,
          invite.email,
          invite.token as string,
          workspaceName,
          invite.role,
        )
        .catch((error) => console.error(error))
      res
        .status(201)
        .json({ success: true, message: "invite created successfully", invite })
    } catch (error) {
      next(error)
    }
  },
  update: async (req: Request, res: Response, next: Function) => {
    try {
      if (!req.params.token || req.params.isAccepted === null)
        return res
          .status(401)
          .json({ success: false, message: "Token required" })
      const { invite, userId } = await inviteRepo.update(
        req.params.token as string,
        req.params.isAccepted as "accepted" | "rejected",
      )
      if (invite.status === "accepted") {
        const existingMembership = await membershipRepo.query({
          userId: userId as Types.ObjectId,
          workspaceId: invite.workspaceId as Types.ObjectId,
        })
        if (existingMembership.memberships.length > 0) {
          return res.status(200).json({
            success: true,
            message: `You are already a member of this workspace`,
          })
        }
        await membershipRepo.create({
          userId: userId as Types.ObjectId,
          workspaceId: invite.workspaceId as Types.ObjectId,
          role: invite.role,
          joinedAt: new Date(),
        })
      }
      return res.status(200).json({
        success: true,
        message: `invite ${invite.status} successfully`,
      })
    } catch (error) {
      next(error)
    }
  },
  delete: async (req: Request, res: Response, next: Function) => {
    try {
      await inviteRepo.delete({
        invitedBy: req.user?._id as Types.ObjectId,
        inviteId: req.params.id as string,
      })
      res
        .status(200)
        .json({ success: true, message: "invite removed successfully" })
    } catch (error) {
      next(error)
    }
  },
  query: async (req: Request, res: Response, next: Function) => {
    try {
      const data = await inviteRepo.query(req.query as IInvite.query)
      res.status(200).json({
        success: true,
        message: "Invites fetched successfully",
        data,
      })
    } catch (error) {
      next(error)
    }
  },
}
export default inviteController
