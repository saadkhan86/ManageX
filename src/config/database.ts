import mongoose from "mongoose"

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log("Connection with database successfull")
  } catch (error: any) {
    console.log(error)
    process.exit(1)
  }
}
export default connection
