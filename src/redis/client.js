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

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

// Reference to redis client.
let client

export function init({host, port}) {
  return new Promise((resolve, reject) => {
    if (client) {
      resolve()
    }

    client = redis.createClient({
      host,
      port,
    })

    client.once('ready', resolve)
    client.once('error', (err) => {
      client = null
      reject(err)
    })
  })
}

export function getClient() {
  return client
}
