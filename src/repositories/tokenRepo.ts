import CustomError from "../errorHandler/CustomError"
import userModel from "../models/user.model"
import { tokenUtils } from "../utils/tokenUtils"

class tokenRepo {
  public async generateAccessToken(token: string) {
    const user = await userModel.findOne({ refreshToken: token })
    if (!user) throw new CustomError("invalid token", 401)
    const refreshToken = tokenUtils.generateAccessToken(user._id)
    const accessToken = tokenUtils.generateRefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save()
    return { accessToken, refreshToken }
  }
}
export default new tokenRepo()
