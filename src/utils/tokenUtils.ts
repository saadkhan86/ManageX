import crypto from "crypto"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"
import CustomError from "../errorHandler/CustomError"
export const tokenUtils = {
  genTokenForVerification: (bytes = 32) => {
    return crypto.randomBytes(bytes).toString("hex")
  },
  generateRefreshToken: (userId: Types.ObjectId | string) => {
    return jwt.sign({ _id: userId }, process.env.JWT_REFRESH_TOKEN as string, {
      expiresIn: "7d",
    })
  },
  generateAccessToken: (userId: Types.ObjectId | string) => {
    return jwt.sign({ _id: userId }, process.env.JWT_ACCESS_TOKEN as string, {
      expiresIn: "30min",
    })
  },
  verifyAccessToken: (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN as string)
      if (typeof decoded == "string")
        throw new CustomError("Invalid token", 401)
      return decoded
    } catch (error) {
      return null
    }
  },
}
