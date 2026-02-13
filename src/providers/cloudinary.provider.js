import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_CLOUD_KEY,
  api_secret: env.CLOUDINARY_CLOUD_SECRET
})

// Khởi tạo 1 cái function để thực hiện upload file lên Cloudinary
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Tạo 1 cái luồng stream upload lên cloudinary vào thư mục folder
    const stream = cloudinary.uploader.upload_stream({ folder: folderName }, (error, result) => {
      if (result) resolve(result)
      else reject(error)
    })
    // Thực hiện upload cái luồng trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const cloudinaryProvider = { streamUpload }