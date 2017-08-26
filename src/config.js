import { envOverride } from 'js-functions'
const APP_ENV = process.env.APP_ENV || 'development'
const NODE_ENV = process.env.NODE_ENV || 'development'

const config = {}

config.development = {
  APP_ENV,
  NODE_ENV,
  PORT            : 8010,
  CORS_ORIGINS    : [/\.*/],
  BUNYAN_LOG_LEVEL: 'info',
  MONGO_URI       : 'mongodb://localhost:27017/auth_server',
  REDIS_HOST      : 'localhost',
  REDIS_PORT      : 6379,
}

config.test = {
  APP_ENV,
  NODE_ENV,
  PORT            : 8081,
  CORS_ORIGINS    : [/\.*/],
  BUNYAN_LOG_LEVEL: 'error',
  MONGO_URI       : 'mongodb://localhost:27017/auth_server_test',
  REDIS_HOST      : 'localhost',
  REDIS_PORT      : 6379,
}

config.staging = {
  APP_ENV,
  NODE_ENV,
  PORT            : 8080,
  CORS_ORIGINS    : [/\.*/],
  BUNYAN_LOG_LEVEL: 'info',
  MONGO_URI       : 'mongodb://localhost:27017/auth_server',
  REDIS_HOST      : 'localhost',
  REDIS_PORT      : 6379,
}

config.production = {
  APP_ENV,
  NODE_ENV,
  PORT            : 8080,
  CORS_ORIGINS    : [/\.*/],
  BUNYAN_LOG_LEVEL: 'info',
  MONGO_URI       : 'mongodb://localhost:27017/auth_server',
  REDIS_HOST      : 'localhost',
  REDIS_PORT      : 6379,
}

export default envOverride(Object.assign({}, config[APP_ENV]))
