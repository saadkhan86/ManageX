import express from "express"
import membershipController from "../controller/membershipController"
import authentication from "../middleware/authentication"
import { requireRole } from "../middleware/roleControll"
import { selfOrAdmin } from "../middleware/selfOradmin"

const membershipRouter = express.Router()

membershipRouter.use(authentication.authUser)

membershipRouter.post("/", membershipController.create)

membershipRouter.patch(
  "/:id",
  requireRole(["admin"]),
  membershipController.update,
)

membershipRouter.delete("/:id", selfOrAdmin, membershipController.delete)

membershipRouter.get(
  "/",
  requireRole(["admin", "manager", "member"]),
  membershipController.query,
)

export default membershipRouter
