import express from 'express'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Get API V1' })
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: 'Create API V1' })
  })
export const boardRoutes = Router