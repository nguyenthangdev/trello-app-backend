import express from 'express'
import { cardValidaton } from '~/validations/card.validation'
import { cardController } from '~/controllers/card.controller'
import { multerUploadMiddleware } from '~/middlewares/multerUpload.middleware'

const Router = express.Router()

Router.route('/')
  .post(cardValidaton.createNew, cardController.createNew)

Router.route('/:id')
  .put(
    multerUploadMiddleware.upload.single('cardCover'),
    cardValidaton.update,
    cardController.update
  )

export const cardRoute = Router
