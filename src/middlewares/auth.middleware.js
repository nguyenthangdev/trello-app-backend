import { StatusCodes } from 'http-status-codes'
import { jwtProvider } from '~/providers/jwt.provider'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken
  // Nếu như cái clientAccessToken không tồn tại thì trả về lỗi luôn
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    return
  }

  try {
    const accessTokenDecoded = await jwtProvider.verifyToken(clientAccessToken, env.JWT_ACCESS_TOKEN_SECRET_SIGNATURE)
    // console.log('accessTokenDecoded: ', accessTokenDecoded)

    req.jwtDecoded = accessTokenDecoded
    next()
  } catch (error) {
    // console.log('error middleware: ', error)
    // Nếu cái accessToken nó bị hết hạn (expired) thì mình cần trả về 1 cái mã lỗi GONE - 410 cho phía FE biết để gọi api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Unauthorized! (token not found)'))
      return
    }
    // Nếu như cái accessToken nó không hợp lệ do bất kỳ điều gì khác vụ hết hạn thì chúng ta cứ thẳng tay trả về mã 401 cho phía FE gọi api logout luôn.
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = {
  isAuthorized
}