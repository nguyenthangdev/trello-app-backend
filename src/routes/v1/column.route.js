import express from 'express'
import { columnValidaton } from '~/validations/column.validation'
import { columnController } from '~/controllers/column.controller'

const Router = express.Router()

Router.route('/')
  .post(columnValidaton.createNew, columnController.createNew)

export const columnRoute = Router
