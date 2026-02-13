import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from './column.model'
import { cardModel } from './card.model'
import { pagingSkipValue } from '~/utils/algorithms'
import { userModel } from './user.model'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(...Object.values(BOARD_TYPES)).required(),

  slug: Joi.string().required().min(3).trim().strict(),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  ownerIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Chỉ định ra những fields mà chúng ta không muốn cho phép cập nhật
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false // returning all validation issues in the details array
  })
}

const createNew = async (userId, data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newBoardToAdd = {
      ...validData,
      ownerIds: [new ObjectId(String(userId))]
    }

    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(newBoardToAdd)
  } catch (error) { throw new Error(error) }
}

const findOneById = async (boardId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(String(boardId))
    })

    return result
  } catch (error) { throw new Error(error) }
}

const getDetails = async (userId, boardId) => {
  try {
    const queryConditions = [
      { _id: new ObjectId(String(boardId)) },
      { _destroy: false },
      { $or: [
        { ownerIds: { $all: [new ObjectId(String(userId))] } },
        { memberIds: { $all: [new ObjectId(String(userId))] } }
      ] }
    ]
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      { $lookup: {
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup: {
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'ownerIds',
        foreignField: '_id',
        as: 'owners',
        // pipeline trong lookup để xử lý 1 hoặc nhiều luồng cần thiết
        // $project để chỉ định vài field không muốn lấy về = cách gán nó giá trị 0
        pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
      } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'memberIds',
        foreignField: '_id',
        as: 'members',
        pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
      } }
    ]).toArray()

    return result[0] || null
  } catch (error) { throw new Error(error) }
}

const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(column.boardId)) },
      { $push: { columnOrderIds: new ObjectId(String(column._id)) } },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) { throw new Error(error) }
}

const pushMemberIds = async (boardId, userId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(boardId)) },
      { $push: { memberIds: new ObjectId(String(userId)) } },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) { throw new Error(error) }
}

const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(column.boardId)) },
      { $pull: { columnOrderIds: new ObjectId(String(column._id)) } },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) { throw new Error(error) }
}

const update = async (boardId, updatedData) => {
  try {
    Object.keys(updatedData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updatedData[fieldName]
      }
    })

    if (updatedData.columnOrderIds) {
      updatedData.columnOrderIds = updatedData.columnOrderIds.map(_id => (new ObjectId(String(_id))))
    }

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(boardId)) },
      { $set: updatedData },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) { throw new Error(error) }
}

const getBoards = async (userId, page, itemsPerPage, queryFilters) => {
  try {
    const queryConditions = [
      { _destroy: false },
      { $or: [
        { ownerIds: { $all: [new ObjectId(String(userId))] } },
        { memberIds: { $all: [new ObjectId(String(userId))] } }
      ] }
    ]

    // Xử lý query flter cho từng trường hợp search board, ví dụ search theo title
    if (queryFilters) {
      Object.keys(queryFilters).forEach(key => {
        // Không phân biệt hoa thường
        queryConditions.push({ [key]: { $regex: new RegExp(queryFilters[key], 'i') } })
      })
    }

    const query = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate(
      [
        { $match: { $and: queryConditions } },
        // sort title của board theo A-Z (mặc định sẽ bị chữ B hoa đứng trước chữ a thường (theo chuẩn bảng mã ASCII))
        { $sort: { createdAt: -1 } },
        // $facet để xử lý nhiều luồng trong 1 query
        { $facet: {
        // Luồng 1: Query boards
          'queryBoards': [
            { $skip: pagingSkipValue(page, itemsPerPage) }, // Bỏ qua số lượng bản ghi của những page trước đó.
            { $limit: itemsPerPage }
          ],

          // Luồng 2: Query đếm tổng tất cả số  lượng bản ghi boards trong DB và trả về vào biến countedAllBoards.
          'queryTotalBoards': [{ $count: 'countedAllBoards' }]
        } }
      ],
      // Khai báo thêm thuộc tính collation locale 'en' để fix vụ chữ B hoa và chữ a thường ở trên.
      { collation: { locale: 'en' } }
    ).toArray()

    const res = query[0]

    return {
      boards: res.queryBoards || [],
      totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0
    }
  } catch (error) { throw new Error(error) }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  getBoards,
  pushMemberIds
}
