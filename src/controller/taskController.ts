import { NextFunction, Request, Response } from "express"
import taskModel from "../models/task.model"
import taskRepo from "../repositories/taskRepo"

const taskController = {
  create: async (req: Request, res: Response, next: Function) => {
    try {
      const task=await taskRepo.create()
    } catch (error) {
      next(error)
    }
  },
  update: async (req: Request, res: Response, next: Function) => {
    try {
    } catch (error) {
      next(error)
    }
  },
  delete: async (req: Request, res: Response, next: Function) => {
    try {
    } catch (error) {
      next(error)
    }
  },
  query: async (req: Request, res: Response, next: Function) => {
    try {
    } catch (error) {
      next(error)
    }
  },
}
export default taskController
