import env from "dotenv"
env.config()
import express, { Request, Response } from "express"
import connection from "./config/database"
import router from "./routes/router"
import returnError from "./utils/responseUtils"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

const app = express()

app.use(helmet({ contentSecurityPolicy: false }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: "Too many requests",
    })
  },
})
app.use(limiter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1", router)
app.use(returnError)
connection()
  .then(() =>
    app.listen(process.env.PORT || 8080, () => {
      console.log(`server is listening on port ${process.env.PORT || "8080"}`)
    }),
  )
  .catch((error: any) => {
    console.log(error)
    process.exit(1)
  })
