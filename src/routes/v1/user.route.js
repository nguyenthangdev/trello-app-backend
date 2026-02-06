import express from 'express'
import { userValidation } from '~/validations/user.validation'
import { userController } from '~/controllers/user.controller'

const Router = express.Router()

Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

export const userRoute = Router