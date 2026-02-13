/* eslint-disable no-unused-vars */
import { userModel } from '~/models/user.model'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants'
// import { brevoProvider } from '~/providers/brevo.provider'
import { mailerSendProvider } from '~/providers/mailerSend.provider'
import { env } from '~/config/environment'
import { jwtProvider } from '~/providers/jwt.provider'
import { cloudinaryProvider } from '~/providers/cloudinary.provider'

const createNew = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')

    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Trello web: Please verify your email before using our services!'
    const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely, <br/> - ThangNguyen - </h3>
    `
    // await brevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)
    const data = await mailerSendProvider.sendEmail({
      to: getNewUser.email,
      toName: process.env.ADMIN_SENDER_NAME,
      subject: customSubject,
      html: htmlContent
    })
    // console.log('mailerSendProvider: ', data)
    return pickUser(getNewUser)
  } catch (error) { throw error }
}

const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active!')

    if (reqBody.token !== existUser.verifyToken) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')

    const updatedData = {
      isActive: true,
      verifyToken: null
    }
    const updatedUser = await userModel.update(existUser._id, updatedData)

    return pickUser(updatedUser)
  } catch (error) { throw error }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    }

    const userInfo = { _id: existUser._id, email: existUser.email }

    const accessToken = await jwtProvider.generateToken(
      userInfo,
      env.JWT_ACCESS_TOKEN_SECRET_SIGNATURE,
      // '5s' // 5s
      env.ACCESS_TOKEN_LIFE
    )
    const refreshToken = await jwtProvider.generateToken(
      userInfo,
      env.JWT_REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) { throw error }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await jwtProvider.verifyToken(clientRefreshToken, env.JWT_REFRESH_TOKEN_SECRET_SIGNATURE)

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessToken = await jwtProvider.generateToken(
      userInfo,
      env.JWT_ACCESS_TOKEN_SECRET_SIGNATURE,
      // '5s' // 5s
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) { throw error }
}

const update = async (userId, reqBody, userAvatarFile) => {
  try {
    const existUser = await userModel.findOneById(userId)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    let updatedUser = {}

    if (reqBody.current_password && reqBody.new_password) {
      if (!bcryptjs.compareSync(reqBody.current_password, existUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your current password is incorrect!')
      }
      updatedUser = await userModel.update(existUser._id, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })
    } else if (userAvatarFile) {
      // Trường hợp upload file lên Cloud Storage, cụ thể là Cloudinary
      const uploadResult = await cloudinaryProvider.streamUpload(userAvatarFile.buffer, 'users')
      // console.log('uploadResult: ', uploadResult)

      // Lưu lại url (secure_url) của cái file ảnh vào trong DB
      updatedUser = await userModel.update(existUser._id, {
        avatar: uploadResult.secure_url
      })
    } else {
      // Trường hợp update các thông tin chung ví dụ displayName
      updatedUser = await userModel.update(userId, reqBody)
    }

    return pickUser(updatedUser)
  } catch (error) { throw error }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update
}