import express from "express"
import inviteController from "../controller/inviteController"
const inviteRouter = express.Router()
inviteRouter.post("/", inviteController.create)
inviteRouter.patch("/:token/:isAccepted", inviteController.update)
inviteRouter.delete("/:id", inviteController.delete)
inviteRouter.get("/", inviteController.query)
export default inviteRouter
