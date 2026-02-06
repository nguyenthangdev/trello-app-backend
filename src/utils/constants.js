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