import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidaton } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Get API V1' })
  })
  .post(boardValidaton.createNew)
export const boardRoute = Router