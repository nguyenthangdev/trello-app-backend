import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/card.service'

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) { next(error) }
}

export const cardController = {
  createNew
}
