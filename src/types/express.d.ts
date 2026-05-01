declare namespace Express {
  interface Request {
    user?: import("../interfaces/IUser").IUser.Doc
  }
}
interface DecodedToken extends jwt.JwtPayload {
  _id: string
}
