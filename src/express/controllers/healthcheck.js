import mongoose   from 'mongoose'
import * as redis from 'redis/client'

export async function healthcheck(req, res) {
  if (!mongoose.connection.readyState) {
    throw new Error('Mongo not connected.')
  }
  if (!redis.getClient()) {
    throw new Error('Redis not connected.')
  }
  res.send({ok: true})
}
