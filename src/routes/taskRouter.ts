import express from "express"
import taskController from "../controller/taskController"
const taskRouter = express.Router()
taskRouter.post("/", taskController.create)
taskRouter.post("/:id", taskController.update)
taskRouter.post("/:id", taskController.delete)
taskRouter.post("/query", taskController.query)
export default taskRouter
