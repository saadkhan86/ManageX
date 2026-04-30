import express from "express"
import userController from "../controller/userController"
const userRouter = express.Router()

userRouter.post("/signup", userController.signup)
userRouter.post("/login", userController.login)
userRouter.patch("/", userController.update)
userRouter.get("/query", userController.query)
userRouter.post(
  "/send-verification-email",
  userController.sendVerificationEmail,
)
userRouter.get("/verify-email/:token", userController.verifyEmail)
export default userRouter
