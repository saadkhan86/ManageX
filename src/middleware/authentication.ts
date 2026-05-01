import { Request, Response } from "express"
import { tokenUtils } from "../utils/tokenUtils"
import CustomError from "../errorHandler/CustomError"
import userModel from "../models/user.model"

const authentication = {
  authUser: async (req: Request, res: Response, next: Function) => {
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) throw new CustomError("Token required", 409)
        let userId = tokenUtils.verifyAccessToken(token)
        if (!userId) throw new CustomError("invalid token", 401)
        const user = await userModel.findById(userId)
        if (!user) throw new CustomError("user not found", 404)
        req.user = user
        next()
      } else {
        throw new CustomError("token required", 401)
      }
    } catch (error) {
      next(error)
    }
  },
}
