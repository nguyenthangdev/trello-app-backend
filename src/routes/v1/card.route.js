import express from 'express'
import { cardValidaton } from '~/validations/card.validation'
import { cardController } from '~/controllers/card.controller'

const Router = express.Router()

Router.route('/')
  .post(cardValidaton.createNew, cardController.createNew)

export const cardRoute = Router
