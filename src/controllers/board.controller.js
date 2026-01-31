import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/board.service'

const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew(req.body)
    console.log('createdBoard from controller: ', createdBoard)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}