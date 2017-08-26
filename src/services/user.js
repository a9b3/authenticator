import bcrypt       from 'bcryptjs'
import uuid         from 'uuid'
import jsonwebtoken from 'jsonwebtoken'
import invariant    from 'invariant'

import userModel    from 'mongoose/user'
import redisClient  from 'redis/client'

// TODO might want to move these to config
const TOKEN_EXPIRE_WEEK = 1
const TOKEN_EXPIRE_DAY  = TOKEN_EXPIRE_WEEK * 7
const TOKEN_EXPIRE_HOUR = TOKEN_EXPIRE_DAY * 24
const TOKEN_EXPIRE_MIN  = TOKEN_EXPIRE_HOUR * 60
const TOKEN_EXPIRE_SEC  = TOKEN_EXPIRE_MIN * 60
const APP_SECRET = 'secret'

/**
 * register will check if user exists, create user if not.
 *
 * @param {!string} email
 * @param {!string} password
 * @returns {object}
 */
export async function register({
  email,
  password,
}) {
  invariant(email, `'email' must be provided.`)
  invariant(password, `'password' must be provided.`)

  const found = await userModel.findOne({email})
  if (found) {
    throw new Error(`User already exists.`)
  }

  return await (new userModel({
    email,
    password: encryptPassword(password),
    id      : uuid.v4(),
  })).save()
}

/**
 * authenticate will validate email/password against db, then create a jwt in
 * redis if its valid.
 *
 * @param {!string} email
 * @param {!string} password
 * @returns {string} jwt
 */
export async function authenticate({
  email,
  password,
}) {
  invariant(email, `'email' must be provided.`)
  invariant(password, `'password' must be provided.`)

  const found = await userModel.findOne({email})
  if (!found) {
    throw new Error(`${email} does not exist.`)
  }
  if (!validatePassword(password, found.password)) {
    throw new Error(`Invalid password.`)
  }

  const jwt = createJWT({
    email,
    id : found.id,
    ttl: TOKEN_EXPIRE_SEC,
  })
  await redisClient.setexAsync(jwt, TOKEN_EXPIRE_SEC, 'true')
  return jwt
}

export async function registerOauth({
  code,
}) {
  // make call against oauth server get access token
  // use access token to get email password
  // register
}

/**
 * Checks given jwt against redis.
 *
 * @param {!string} jwt
 * @returns {bool}
 */
export async function verify({
  jwt,
}) {
  invariant(jwt, `'jwt' must be provided.`)

  const found = await redisClient.getAsync(jwt)
  return Boolean(found)
}

function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

function validatePassword(password, hash) {
  return bcrypt.compareSync(password, hash)
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
