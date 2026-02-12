export const inviteUserToBoardSocket = (socket) => {
  // Lắng nghe sự kiện mà client emit lên có tên là FE_USER_INVITED_TO_BOARD
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    // Cách làm nhanh và đơn giản nhất: Emit ngược lại 1 sự kiện về cho mọi client khác (ngoại trừ chính cái thằng gửi request lên), để cho FE check
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}