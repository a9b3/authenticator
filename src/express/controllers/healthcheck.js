import mongoose    from 'mongoose'
import * as redis  from 'redis/client'
import * as errors from 'domain/errors'

export async function healthcheck(req, res) {
  if (!mongoose.connection.readyState) {
    throw errors.GenericError('Mongo not connected.')
  }
  if (!redis.getClient()) {
    throw errors.GenericError('Redis not connected.')
  }
  res.send({ok: true})
}
