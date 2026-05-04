import express from "express"
import tokenController from "../controller/tokenController"
const tokenRouter = express.Router()
tokenRouter.get(
  "/generate-access-token/:refreshToken",
  tokenController.generateAccessToken,
)
export default tokenRouter
