import express from 'express'
import { boardValidaton } from '~/validations/board.validation'
import { boardController } from '~/controllers/board.controller'

const Router = express.Router()

Router.route('/')
  .get(boardController.getBoards)
  .post(boardValidaton.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidaton.update, boardController.update)

Router.route('/supports/moving_card')
  .put(boardValidaton.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

export const boardRoute = Router
