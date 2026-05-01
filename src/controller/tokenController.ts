import { Request, Response } from "express"
import tokenRepo from "../repositories/tokenRepo"

const tokenController = {
  generateAccessToken: async (req: Request, res: Response, next: Function) => {
    try {
      if (!req.params || !req.params.refreshToken)
        return res
          .status(401)
          .json({ success: false, message: "Token required" })
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
