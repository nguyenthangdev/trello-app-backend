import express from 'express'
import { invitationValidation } from '~/validations/invitation.validation'
import { invitationController } from '~/controllers/invitation.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const Router = express.Router()

Router.route('/board')
  .post(
    authMiddleware.isAuthorized,
    invitationValidation.createNewBoardInvitation,
    invitationController.createNewBoardInvitation
  )

export const invitationRoute = Router
