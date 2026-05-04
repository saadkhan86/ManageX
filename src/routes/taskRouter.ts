import express from "express"
import taskController from "../controller/taskController"
const taskRouter = express.Router()
taskRouter.post("/", taskController.create)
taskRouter.patch("/:id", taskController.update)
taskRouter.delete("/:id", taskController.delete)
taskRouter.get("/", taskController.query)
export default taskRouter
