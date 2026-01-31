import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/board.model'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModel.createNew(newBoard)
    
    const getNewBoard = await boardModel.fineOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew
}