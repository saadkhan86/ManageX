import { Types } from "mongoose"
import CustomError from "../errorHandler/CustomError"
import { IUser } from "../interfaces/IUser"
import userModel from "../models/user.model"
import { tokenUtils } from "../utils/tokenUtils"

class userRepo {
  public async oAuth(data: IUser.oAuthCreate) {
    let user = await userModel
      .findOne({ email: data.email })
      .select(
        "+loginCount +lastLoginAt +lastSeenAt +emailVerificationToken +emailVerificationTokenExpires +failedLoginAttempts +isActive",
      )
    if (user) {
      user.loginCount++
      user.isEmailVerified = true
      user.lastLoginAt = new Date(Date.now())
      user.lastSeenAt = new Date(Date.now())
      user.emailVerificationToken = null
      user.emailVerificationTokenExpires = null
      user.failedLoginAttempts = 0
      user.provider = data.provider
      user.providerId = data.providerId
      user.isActive = true
      user.refreshToken = tokenUtils.generateRefreshToken(
        new Types.ObjectId(user?._id),
      )
      user = await user.save()
      const accessToken = tokenUtils.generateAccessToken(
        new Types.ObjectId(user?._id),
      )
      return { user, accessToken }
    }
    user = new userModel({
      ...data,
      isEmailVerified: true,
      isActive: true,
      lastLoginAt: new Date(Date.now()),
      lastSeenAt: new Date(Date.now()),
    })
    user.refreshToken = tokenUtils.generateRefreshToken(
      new Types.ObjectId(user?._id),
    )
    user = await user.save()
    const accessToken = tokenUtils.generateAccessToken(
      new Types.ObjectId(user?._id),
    )
    return { user, accessToken }
  }
  public async signup(data: IUser.signup) {
    const emailVerificationToken = tokenUtils.genTokenForVerification(32)
    const emailVerificationTokenExpires = Date.now() + 30 * 60 * 1000
    const user = await userModel.create({
      email: data.email,
      name: data.name,
      username: data.username,
      passwordHash: data.password,
      emailVerificationToken,
      emailVerificationTokenExpires: new Date(emailVerificationTokenExpires),
      isEmailVerified: false,
      provider: "local",
    })
    return {
      user,
      emailVerificationToken,
      emailVerificationTokenExpires: emailVerificationTokenExpires - Date.now(),
    }
  }
  public async sendVerificationEmail(email: string) {
    let user = await userModel
      .findOne({ email })
      .select("+emailVerificationToken +emailVerificationTokenExpires")
    if (!user) {
      throw new CustomError(`user not found associated with this ${email}`, 404)
    }
    if (user.isEmailVerified) {
      throw new CustomError("email already verified", 200)
    }
    const emailVerificationToken = tokenUtils.genTokenForVerification(32)
    const emailVerificationTokenExpires = Date.now() + 30 * 60 * 1000
    user.emailVerificationToken = emailVerificationToken
    user.emailVerificationTokenExpires = new Date(emailVerificationTokenExpires)
    user = await user.save()
    return {
      user,
      emailVerificationToken,
      emailVerificationTokenExpires,
    }
  }
  public async verifyEmail(token: string) {
    let user = await userModel
      .findOne({ emailVerificationToken: token })
      .select("+emailVerificationToken +emailVerificationTokenExpires")
    if (!user || !user.emailVerificationTokenExpires)
      throw new CustomError("invalid token or user not created yet", 404)
    if (user.emailVerificationTokenExpires.getTime() < Date.now()) {
      throw new CustomError("token expired", 401)
    }
    user.emailVerificationToken = null
    user.emailVerificationTokenExpires = null
    user.isEmailVerified = true
    return await user.save()
  }
  public async login(data: IUser.login) {
    let user = await userModel
      .findOne({
        email: data.email,
      })
      .select("+passwordHash +isBlocked +failedLoginAttempts +loginCount")
    if (!user) throw new CustomError("user not found", 404)
    if (!user.isEmailVerified)
      throw new CustomError("email verification required", 403)
    const isMatched = await user.comparePassword(data.password)
    if (!isMatched) {
      user.failedLoginAttempts++
      await user.save().then(() => {
        throw new CustomError("invalid password", 401)
      })
    }
    if (user.failedLoginAttempts >= 5) {
      user.isBlocked = true
      user.blockedAt = new Date(Date.now())
      user.failedLoginAttempts++
      await user.save()
      throw new CustomError("your account is temporary locked", 423)
    }
    const refreshToken = tokenUtils.generateRefreshToken(
      new Types.ObjectId(user._id),
    )
    const accessToken = tokenUtils.generateAccessToken(
      new Types.ObjectId(user._id),
    )
    user.refreshToken = refreshToken
    user.failedLoginAttempts = 0
    user.loginCount++
    user.lastSeenAt = new Date(Date.now())
    user = await user.save()
    return { accessToken, refreshToken, user }
  }
  public async update(userId: Types.ObjectId | string, data: IUser.update) {
    let user = await userModel.findById(userId)
    if (!user) throw new CustomError("user not found", 404)
    if (data.name) user.name = data.name
    if (data.bio) user.bio = data.bio
    if (data.country) user.country = data.country
    if (data.phoneNumber) user.phoneNumber = data.phoneNumber
    if (data.timezone) user.timezone = data.timezone
    return await user.save()
  }
  public async query(data: IUser.query) {
    let { page = 1, limit = 10 } = data
    let _query: Record<string, any> = {}
    if (data.email) _query.email = data.email
    if (data.name) _query.name = data.name
    if (data.userId) _query.userId = data.userId
    if (data.username) _query.username = data.username
    const user = await userModel
      .find(_query)
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .lean()
    const count = await userModel.countDocuments(_query)
    return { user, count }
  }
}
export default new userRepo()
