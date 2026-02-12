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

// Lấy những thông báo của user hiện tại
Router.route('/')
  .get(authMiddleware.isAuthorized, invitationController.getInvitations)

// Cập nhật 1 bản ghi Board Invitation
Router.route('/board/:invitationId')
  .put(authMiddleware.isAuthorized, invitationController.updateBoardInvitation)

export const invitationRoute = Router
