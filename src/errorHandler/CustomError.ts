import { Error } from "mongoose"

class CustomError extends Error {
  constructor(message: string, code: number, options?: any) {
    super(message)
    this.code = code
    this.options = options
  }
  code: number
  options: number
}
export default CustomError
