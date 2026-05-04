import express from "express"
import userRouter from "./userRouter"
import workspaceRouter from "./workspaceRouter"
import membershipRouter from "./membershipRouter"
import inviteRouter from "./inviteRouter"
import taskRouter from "./taskRouter"
import tokenRouter from "./tokenRouter"
const router = express.Router()
router.use("/user", userRouter)
router.use("/token", tokenRouter)
router.use("/invite", inviteRouter)
router.use("/workspace", workspaceRouter)
router.use("/membership", membershipRouter)
router.use("/task", taskRouter)
export default router
