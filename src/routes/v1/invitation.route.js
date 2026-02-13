import express from 'express'
import { invitationValidation } from '~/validations/invitation.validation'
import { invitationController } from '~/controllers/invitation.controller'

const Router = express.Router()

Router.route('/board')
  .post(
    invitationValidation.createNewBoardInvitation,
    invitationController.createNewBoardInvitation
  )

Router.route('/')
  .get(invitationController.getInvitations)

Router.route('/board/:invitationId')
  .put(invitationController.updateBoardInvitation)

export const invitationRoute = Router
