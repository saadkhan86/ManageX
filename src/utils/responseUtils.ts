import { NextFunction, Request, Response } from "express"
import CustomError from "../errorHandler/CustomError"
import mongoose from "mongoose"

const returnError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error)
  }

  if (error instanceof CustomError) {
    return res
      .status(error.code)
      .json({ success: false, message: error.message })
  }

  if (error instanceof mongoose.MongooseError) {
    return res.status(400).json({ success: false, message: error.message })
  }

  if (error instanceof Error) {
    return res.status(500).json({ success: false, message: error.message })
  }
  console.log(error.message)
  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" })
}
export default returnError
