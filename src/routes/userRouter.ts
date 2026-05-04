import express from "express"
import userController from "../controller/userController"
import authentication from "../middleware/authentication"
const userRouter = express.Router()

userRouter.post("/signup", userController.signup)
userRouter.post("/login", userController.login)
userRouter.patch("/update", authentication.authUser, userController.update)
userRouter.get("/", authentication.authUser, userController.query)
userRouter.post(
  "/send-verification-email",
  userController.sendVerificationEmail,
)
userRouter.get("/verify-email/:token", userController.verifyEmail)
export default userRouter
