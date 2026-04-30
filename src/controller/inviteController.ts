import { NextFunction, Request, Response } from "express"
import inviteRepo from "../repositories/inviteRepo"
import { IInvite } from "../interfaces/IInvite"
import emailUtils from "../utils/emailUtils"

const inviteController = {
  create: async (req: Request, res: Response, next: Function) => {
    try {
      const invite = await inviteRepo.create(req.body as IInvite.create)
      emailUtils
        .sendInviteEmail(req.user.name, invite.email, invite.token)
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
      const invite = await inviteRepo.update(
        req.params.token as string,
        req.params.isAccepted as "accepted" | "rejected",
      )
    } catch (error) {
      next(error)
    }
  },
  delete: async (req: Request, res: Response, next: Function) => {
    try {
      const invite = await inviteRepo.delete({
        invitedBy: req.user._id,
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
