import express from 'express'
import { boardRoute } from './board.route'
import { columnRoute } from './column.route'
import { cardRoute } from './card.route'
import { userRoute } from './user.route'
import { invitationRoute } from './invitation.route'
import { authMiddleware } from '~/middlewares/auth.middleware'

const Router = express.Router()

Router.use('/boards', authMiddleware.isAuthorized, boardRoute)
Router.use('/columns', authMiddleware.isAuthorized, columnRoute)
Router.use('/cards', authMiddleware.isAuthorized, cardRoute)
Router.use('/users', userRoute)
Router.use('/invitations', authMiddleware.isAuthorized, invitationRoute)

export const APIs_V1 = Router
