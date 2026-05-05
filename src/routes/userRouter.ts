import express, { Request, Response } from "express"
import userController from "../controller/userController"
import authentication from "../middleware/authentication"
import rateLimit from "express-rate-limit"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Too many requests",
    })
  },
})
const userRouter = express.Router()

userRouter.post("/signup", userController.signup)
userRouter.post("/login", limiter, userController.login)
userRouter.patch("/update", authentication.authUser, userController.update)
userRouter.get("/", authentication.authUser, userController.query)
userRouter.post(
  "/send-verification-email",
  userController.sendVerificationEmail,
)
userRouter.get("/verify-email/:token", userController.verifyEmail)
export default userRouter
