import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './board.route'
import { columnRoute } from './column.route'
import { cardRoute } from './card.route'
import { userRoute } from './user.route'
import { invitationRoute } from './invitation.route'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API V1' })
})
Router.use('/boards', boardRoute)
Router.use('/columns', columnRoute)
Router.use('/cards', cardRoute)
Router.use('/users', userRoute)
Router.use('/invitations', invitationRoute)

export const APIs_V1 = Router
