import express from "express"
import workspaceController from "../controller/workspaceController"
const workspaceRouter = express.Router()
workspaceRouter.post("/", workspaceController.create)
workspaceRouter.patch("/:id", workspaceController.update)
workspaceRouter.delete("/:id", workspaceController.delete)
workspaceRouter.get("/query", workspaceController.query)
export default workspaceRouter
