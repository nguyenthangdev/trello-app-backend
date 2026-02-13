import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'
import { cloudinaryProvider } from '~/providers/cloudinary.provider'

const createNew = async (reqBody) => {
  try {
    const newCard = { ...reqBody }
    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) await columnModel.pushCardOrderIds(getNewCard)

    return getNewCard
  } catch (error) { throw error }
}

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updatedData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    let updatedCard = {}

    if (cardCoverFile) {
      const uploadResult = await cloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    } else if (updatedData.commentToAdd) {
      // Tạo dữ liệu comment để thêm vào DB, cần bổ sung thêm những field cần thiết.
      const commentData = {
        ...updatedData.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      updatedCard = await cardModel.unShiftNewComment(cardId, commentData)
    } else if (updatedData.incomingMemberInfo) {
      // Truờng hợp ADD hoặc REMOVE thành viên ra khỏi card
      updatedCard = await cardModel.updateMembers(cardId, updatedData.incomingMemberInfo)
    } else {
      updatedCard = await cardModel.update(cardId, updatedData)
    }

    return updatedCard
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  update
}
