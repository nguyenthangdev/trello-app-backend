import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidaton } from '~/validations/board.validation'
import { boardController } from '~/controllers/board.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Get API V1' })
  })
  .post(authMiddleware.isAuthorized, boardValidaton.createNew, boardController.createNew)

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, boardValidaton.update, boardController.update)

Router.route('/supports/moving_card')
  .put(authMiddleware.isAuthorized, boardValidaton.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoute = Router
