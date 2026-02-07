import JWT from 'jsonwebtoken'

const generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    return JWT.sign(payload, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const jwtProvider = {
  generateToken,
  verifyToken
}