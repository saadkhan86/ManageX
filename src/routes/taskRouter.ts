import express from "express"
import taskController from "../controller/taskController"
import authentication from "../middleware/authentication"
const taskRouter = express.Router()
taskRouter.use(authentication.authUser)
taskRouter.post("/", taskController.create)
taskRouter.patch("/:id", taskController.update)
taskRouter.delete("/:id", taskController.delete)
taskRouter.get("/", taskController.query)
export default taskRouter
