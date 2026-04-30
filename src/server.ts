import env from "dotenv"
env.config()
import express from "express"
import connection from "./config/database"
import router from "./routes/router"
import returnError from "./utils/responseUtils"

const app = express()

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
