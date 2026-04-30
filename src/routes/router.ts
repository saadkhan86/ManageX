import express from "express"
import userRouter from "./userRouter"
import workspaceRouter from "./workspaceRouter"
import membershipRouter from "./membershipRouter"
import inviteRouter from "./inviteRouter"
import taskRouter from "./taskRouter"
const router = express.Router()
router.use("/user", userRouter)
router.use("/workspace", workspaceRouter)
router.use("/membership", membershipRouter)
router.use("/invite", inviteRouter)
router.use("/task", taskRouter)
export default router
