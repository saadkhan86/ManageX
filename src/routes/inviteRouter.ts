import express from "express"
import inviteController from "../controller/inviteController"
import authentication from "../middleware/authentication"
const inviteRouter = express.Router()
inviteRouter.get("/:token/:isAccepted", inviteController.update)
inviteRouter.use(authentication.authUser)
inviteRouter.post("/", inviteController.create)
inviteRouter.delete("/:id", inviteController.delete)
inviteRouter.get("/", inviteController.query)
export default inviteRouter
