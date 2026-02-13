import express from 'express'
import { columnValidaton } from '~/validations/column.validation'
import { columnController } from '~/controllers/column.controller'

const Router = express.Router()

Router.route('/')
  .post(columnValidaton.createNew, columnController.createNew)

Router.route('/:id')
  .put(columnValidaton.update, columnController.update)
  .delete(columnValidaton.deleteItem, columnController.deleteItem)

export const columnRoute = Router
