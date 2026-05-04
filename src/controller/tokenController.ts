import { Request, Response } from "express"
import tokenRepo from "../repositories/tokenRepo"
import CustomError from "../errorHandler/CustomError"

const tokenController = {
  generateAccessToken: async (req: Request, res: Response, next: Function) => {
    try {
      if (!req.params || !req.params.refreshToken)
        throw new CustomError("Token required", 401)
      const oldRefreshToken = req.params.refreshToken
      const tokens = await tokenRepo.generateAccessToken(
        oldRefreshToken as string,
      )
      res.status(201).json({
        success: true,
        message: "Token generated successfull",
        tokens,
      })
    } catch (error) {
      next(error)
    }
  },
}
export default tokenController
