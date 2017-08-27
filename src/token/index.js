import jsonwebtoken from 'jsonwebtoken'
import * as redis   from 'redis/client'

const APP_SECRET = 'secret'

export async function create({
  email,
  id,
  ttl,
}) {
  const jwt = createJWT({
    email,
    id ,
    ttl,
  })
  await redis.getClient().setexAsync(jwt, ttl, 'true')
  return jwt
}

function createJWT({
  email,
  id,
  ttl,
}) {
  return jsonwebtoken.sign(
    {
      email,
      id,
      ttl,
    },
    APP_SECRET,
    {
      expiresIn: ttl,
    },
  )
}
