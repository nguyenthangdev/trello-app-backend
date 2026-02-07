import express from 'express'
import { columnValidaton } from '~/validations/column.validation'
import { columnController } from '~/controllers/column.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, columnValidaton.createNew, columnController.createNew)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, columnValidaton.update, columnController.update)
  .delete(authMiddleware.isAuthorized, columnValidaton.deleteItem, columnController.deleteItem)

export const columnRoute = Router
