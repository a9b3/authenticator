import mongoose    from 'mongoose'
import redisClient from 'redis/client'

export async function healthcheck(req, res) {
  if (!mongoose.connection.readyState) {
    throw new Error('Mongo not connected.')
  }
  if (!redisClient) {
    throw new Error('Redis not connected.')
  }
  res.send({ok: true})
}
