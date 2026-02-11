import express from 'express'
import { cardValidaton } from '~/validations/card.validation'
import { cardController } from '~/controllers/card.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'
import { multerUploadMiddleware } from '~/middlewares/multerUpload.middleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, cardValidaton.createNew, cardController.createNew)

Router.route('/:id')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('cardCover'),
    cardValidaton.update,
    cardController.update
  )

export const cardRoute = Router
