import mongooseDb       from 'mongoose/db'
import * as redisClient from 'redis/client'
import config           from 'config'

export async function setup() {
  await mongooseDb.connect(config.MONGO_URI)
  await mongooseDb.dangerouslyClearDb()
  await redisClient.init({host: config.REDIS_HOST, port: config.REDIS_PORT})
}

export async function teardown() {
  await mongooseDb.dangerouslyClearDb()
}
