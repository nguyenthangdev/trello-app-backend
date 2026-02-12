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

export const WEBSITE_DOMAIN = env.BUILD_MODE === 'production' ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const INVITATION_TYPES = {
  BOARD_INVITATION: 'BOARD_INVITATION'
}

export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

export const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

export const CARD_MEMBER_ACTIONS = {
  ADD:'ADD',
  REMOVE: 'REMOVE'
}