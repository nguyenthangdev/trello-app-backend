import express from 'express'
import { cardValidaton } from '~/validations/card.validation'
import { cardController } from '~/controllers/card.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, cardValidaton.createNew, cardController.createNew)

export const cardRoute = Router
