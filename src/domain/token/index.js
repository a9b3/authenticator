import invariant    from 'invariant'
import jsonwebtoken from 'jsonwebtoken'
import * as redis   from 'redis/client'

const APP_SECRET = 'secret'

/**
 * @returns {string}
 */
export async function create({
  email,
  id,
  ttl,
  ip,
  userAgent,
}) {
  invariant(id, `'id' must be provided.`)

  const jwt = jsonwebtoken.sign(
    {
      email,
      id,
      ttl,
      ip,
      userAgent,
    },
    APP_SECRET,
    {
      expiresIn: ttl,
    },
  )
  await redis.getClient().setexAsync(getRedisKey(id, jwt), ttl, 'true')
  return jwt
}

/**
 * Invalidate will remove given jwt from datastore.
 *
 * @param {!string} jwt
 */
export async function invalidate({jwt}) {
  if (!jwt) return
  const decoded = jsonwebtoken.verify(jwt, APP_SECRET)
  await redis.getClient().delAsync(getRedisKey(decoded.id, jwt))
}

/**
 * Checks given jwt against redis.
 *
 * @param {!string} jwt
 * @returns {bool}
 */
export async function verify({jwt}) {
  invariant(jwt, `'jwt' must be provided.`)
  const decoded = jsonwebtoken.verify(jwt, APP_SECRET)
  const found = await redis.getClient().getAsync(getRedisKey(decoded.id, jwt))
  return Boolean(found)
}

/**
 * @returns {array<string>}
 */
export async function getUserTokens({jwt}) {
  const decoded = jsonwebtoken.verify(jwt, APP_SECRET)
  return await redis.getClient().keysAsync(`${decoded.id}*`)
}

function getRedisKey(id, jwt) {
  return `${id}:${jwt}`
}
