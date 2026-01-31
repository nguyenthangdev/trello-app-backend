import { env } from '~/config/environment'

// Những domain đc phép truy cập tới tài nguyên của server
export const WHITELIST_DOMAINS = [
  env.CLIENT_URL
  // Ví dụ sau này sẽ deploy lên domain chính thức,...
]

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}