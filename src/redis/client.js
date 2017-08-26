/*
 * Wrap redis client to return promises.
 * All functions are appended with Async
 *
 * ex.
 *
 * redis.get()
 *
 *  becomes
 *
 * redis.getAsync()
 */
import redis    from 'redis'
import bluebird from 'bluebird'

import config   from 'config'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

export default redis.createClient({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
})
