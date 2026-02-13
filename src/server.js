/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandling.middleware'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import cookieParser from 'cookie-parser'
import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket } from '~/sockets/inviteUserToBoard.socket'

const START_SERVER = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())

  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  // Tạo 1 cái server mới, bọc thằng app của express để làm real-time với socket.io
  const server = http.createServer(app)

  // Khởi tạo biến io với server và cors
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    // Gọi các socket tùy theo tính năng
    inviteUserToBoardSocket(socket)

    //..
  })

  if (env.BUILD_MODE === 'production') {
    // Dùng server.listen thay vì app.listen vì lúc này server đã bao gồm express app và đã config socket.io
    server.listen(process.env.PORT, () => {
      console.log(`3. Production: Hello ${env.AUTHOR}, Back-end Server is running successfully at Port: ${process.env.PORT}`)
    })
  } else {
    // Dùng server.listen thay vì app.listen vì lúc này server đã bao gồm express app và đã config socket.io
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`3. Local: Hello ${env.AUTHOR}, Back-end Server is running successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`)
    })
  }

  // Thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas!')
  })
}

// Chỉ khi kết nối tới Database thành công thì mới Start Server Back-end lên.
// Immediately-invoked / Anonymous Async Functions (IIFE)
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')

    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// // Chỉ khi kết nối tới Database thành công thì mới Start Server Back-end lên.
// console.log('1. Connecting to MongoDB Cloud Atlas...')
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
