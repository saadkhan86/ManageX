import { Request, Response } from "express"
import { tokenUtils } from "../utils/tokenUtils"
import CustomError from "../errorHandler/CustomError"
import userModel from "../models/user.model"
import { Types } from "mongoose"

const authentication = {
  authUser: async (req: Request, res: Response, next: Function) => {
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        const token = req.headers.authorization.split(" ")[1]
        if (!token) throw new CustomError("Token required", 409)
        let decoded: any = tokenUtils.verifyAccessToken(token)
        if (!decoded) throw new CustomError("invalid token", 401)
        const user = await userModel.findById(decoded._id)
        if (!user) throw new CustomError("user not found", 404)
        req.user = user
        next()
      } else {
        throw new CustomError("token required", 401)
      }
    } catch (error: any) {
      console.error("Authentication Error:", error.message || error)
      next(error)
    }
  },
}
export default authentication
