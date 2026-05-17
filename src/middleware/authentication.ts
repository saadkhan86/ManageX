import { Request, Response } from "express"
import { tokenUtils } from "../utils/tokenUtils"
import CustomError from "../errorHandler/CustomError"
import userModel from "../models/user.model"
import admin from "../services/firebase.service"

const authentication = {
  authUser: async (req: Request, res: Response, next: Function) => {
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        const token = req.headers.authorization.split(" ")[1]
        let user: any
        try {
          const decodedByFirebase = await admin.auth().verifyIdToken(token)
          user = await userModel.findOne({ providerId: decodedByFirebase.uid })
          if (!user) {
            user = await userModel.create({
              email: decodedByFirebase.email,
              name:
                decodedByFirebase.name ||
                decodedByFirebase.email?.split("@")[0] ||
                "ManageX User",
              isEmailVerified: decodedByFirebase.email_verified,
              phoneNumber: decodedByFirebase.phone_number,
              avatarUrl: decodedByFirebase.picture,
              provider: decodedByFirebase.firebase.sign_in_provider,
              providerId: decodedByFirebase.uid,
            })
          }
        } catch (firebaseError) {
          try {
            const decodedByJWT = tokenUtils.verifyAccessToken(token)
            user = await userModel.findById(decodedByJWT?._id)
            if (!user)
              return res
                .status(404)
                .json({ success: false, message: "user not found" })
          } catch (jwtError) {
            return res
              .status(401)
              .json({ success: false, message: "Invalid or Expired token" })
          }
        }
        req.user = user
        return next()
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
