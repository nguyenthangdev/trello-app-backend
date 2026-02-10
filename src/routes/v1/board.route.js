import express from 'express'
import { boardValidaton } from '~/validations/board.validation'
import { boardController } from '~/controllers/board.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getBoards)
  .post(authMiddleware.isAuthorized, boardValidaton.createNew, boardController.createNew)

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, boardValidaton.update, boardController.update)

Router.route('/supports/moving_card')
  .put(authMiddleware.isAuthorized, boardValidaton.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoute = Router
