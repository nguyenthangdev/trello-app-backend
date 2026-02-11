import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/board.route'
import { columnRoute } from '~/routes/v1/column.route'
import { cardRoute } from '~/routes/v1/card.route'
import { userRoute } from '~/routes/v1/user.route'
import { invitationRoute } from '~/routes/v1/invitation.route'

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
