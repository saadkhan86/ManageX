import crypto from "crypto"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"
import CustomError from "../errorHandler/CustomError"
export const tokenUtils = {
  genTokenForVerification: (bytes = 32) => {
    return crypto.randomBytes(bytes).toString("hex")
  },
  generateRefreshToken: (userId: Types.ObjectId | string) => {
    return jwt.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: "7d",
    })
  },
  generateAccessToken: (userId: Types.ObjectId | string) => {
    return jwt.sign({ _id: userId }, process.env.JWT_ACCESS_TOKEN as string, {
      expiresIn: "30min",
    })
  },
  verifyAccessToken: async (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN as string)
      if (typeof decoded == "string")
        throw new CustomError("Invalid token", 401)
      return decoded._id
    } catch (error) {
      return null
    }
  },
}
