import express from "express"
import membershipController from "../controller/membershipController"
const membershipRouter = express.Router()
membershipRouter.post("/", membershipController.create)
membershipRouter.patch("/:id", membershipController.update)
membershipRouter.delete("/:id", membershipController.delete)
membershipRouter.get("/", membershipController.query)
export default membershipRouter
