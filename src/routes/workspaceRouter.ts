import express from "express"
import workspaceController from "../controller/workspaceController"
import authentication from "../middleware/authentication"
const workspaceRouter = express.Router()
workspaceRouter.use(authentication.authUser)
workspaceRouter.post("/", workspaceController.create)
workspaceRouter.patch("/:id", workspaceController.update)
workspaceRouter.delete("/:id", workspaceController.delete)
workspaceRouter.get("/", workspaceController.query)
export default workspaceRouter
