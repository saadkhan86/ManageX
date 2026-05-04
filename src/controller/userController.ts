import { Request, Response, NextFunction } from "express"
import userRepo from "../repositories/userRepo"
import { IUser } from "../interfaces/IUser"
import returnError from "../utils/responseUtils"
import emailUtils from "../utils/emailUtils"
const userController = {
  oAuth: async (req: Request, res: Response, next: Function) => {
    try {
      const user = await userRepo.oAuth(req.body as IUser.oAuthCreate)
      res
        .status(201)
        .json({ success: true, message: "user created successfully", user })
    } catch (error) {
      next(error)
    }
  },
  signup: async (req: Request, res: Response, next: Function) => {
    try {
      const user = await userRepo.signup(req.body as IUser.signup)
      emailUtils
        .sendVerificationEmail(user.user.email, user.emailVerificationToken)
        .catch((error: any) =>
          console.error("Email verification failed:", error),
        )
      res.status(201).json({
        success: true,
        message: `Hi' ${req.body.name} your account has been created successfully. Verification email sent to ${req.body.email}`,
      })
    } catch (error) {
      next(error)
    }
  },
  sendVerificationEmail: async (
    req: Request,
    res: Response,
    next: Function,
  ) => {
    try {
      if (!req.body.email)
        return res
          .status(401)
          .json({ success: false, message: "email is required" })
      const user = await userRepo.sendVerificationEmail(
        req.body.email as string,
      )
      emailUtils
        .sendVerificationEmail(user.user.email, user.emailVerificationToken)
        .catch(console.error)
      res.status(201).json({
        success: true,
        message: `Hi' ${req.body.name} Verification email has been sent to ${req.body.email}`,
      })
    } catch (error) {
      next(error)
    }
  },
  verifyEmail: async (req: Request, res: Response, next: Function) => {
    try {
      if (!req.params.token) {
        return res
          .status(401)
          .json({ success: false, message: "Token is required" })
      }
      const verification = await userRepo.verifyEmail(
        req.params.token as string,
      )
      res.status(200).json({
        success: true,
        message: "verification successfull now you can login to your account",
      })
    } catch (error) {
      next(error)
    }
  },
  login: async (req: Request, res: Response, next: Function) => {
    try {
      const { email, password } = req.body
      let user = await userRepo.login({ email, password })
      console.log(user.accessToken)
      return res.status(200).json({
        success: true,
        message: "user logged in successfully",
        data: user,
      })
    } catch (error) {
      next(error)
    }
  },
  update: async (req: Request, res: Response, next: Function) => {
    try {
      const user = await userRepo.update(
        req.user!._id,
        req.body as IUser.update,
      )
      res
        .status(200)
        .json({ success: true, message: "profile updated successfully" })
    } catch (error) {
      next(error)
    }
  },
  query: async (req: Request, res: Response, next: Function) => {
    try {
      const data = await userRepo.query(req.query as IUser.query)
      res
        .status(200)
        .json({ success: true, message: "user fetched successfully", data })
    } catch (error) {
      next(error)
    }
  },
}

export default userController
