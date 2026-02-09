import multer from 'multer'
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '~/utils/constants'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// Function kiểm tra loại file nào đc chấp nhận.
const customFileFilter = (req, file, callback) => {
  // Đối với multer, kiểm tra kiểu file thì sử dụng mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    // Khi gặp lỗi sẽ trả về chuẩn cái xử lý lỗi tập trung errorHandlingMiddleware
    return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage), null)
  }
  return callback(null, true)
}

// Khởi tạo function upload đc bọc bởi multer
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }