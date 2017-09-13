import bcrypt      from 'bcryptjs'
import uuid        from 'uuid'
import invariant   from 'invariant'

import * as errors from 'errors'
import * as token  from 'token'
import userModel   from 'db/models/user'

// TODO might want to move these to config
const TOKEN_EXPIRE_WEEK = 1
const TOKEN_EXPIRE_DAY  = TOKEN_EXPIRE_WEEK * 7
const TOKEN_EXPIRE_HOUR = TOKEN_EXPIRE_DAY * 24
const TOKEN_EXPIRE_MIN  = TOKEN_EXPIRE_HOUR * 60
const TOKEN_EXPIRE_SEC  = TOKEN_EXPIRE_MIN * 60

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
  facebook,
}) {
  invariant(email, `'email' must be provided.`)
  invariant(password, `'password' must be provided.`)

  const found = await userModel.findOne({email})
  if (found) {
    throw errors.GenericError(`User already exists.`)
  }

  return await (new userModel({
    email,
    password: encryptPassword(password),
    id      : uuid.v4(),
    facebook,
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
  ip,
  userAgent,
}) {
  invariant(email, `'email' must be provided.`)
  invariant(password, `'password' must be provided.`)

  const found = await userModel.findOne({email})
  if (!found) {
    throw errors.GenericError(`${email} does not exist.`)
  }
  if (!validatePassword(password, found.password)) {
    throw errors.GenericError(`Invalid password.`)
  }

  return await token.create({
    ip,
    userAgent,
    email,
    id : found.id,
    ttl: TOKEN_EXPIRE_SEC,
  })
}

/**
 * Changes password to newPassword for the given id.
 *
 * @param {!string} id
 * @param {!string} oldPassword
 * @param {!string} newPassword
 */
export async function changePassword({
  id,
  oldPassword,
  newPassword,
}) {
  invariant(id, `'id' must be provided.`)
  invariant(oldPassword, `'oldPassword' must be provided.`)
  invariant(newPassword, `'newPassword' must be provided.`)

  const found = await userModel.findOne({id})
  if (!found) {
    throw new Error(`Cannot find user.`)
  }
  if (!validatePassword(oldPassword, found.password)) {
    throw new Error(`Invalid password.`)
  }

  await userModel.update({id}, {
    $set: {
      password: encryptPassword(newPassword),
    },
  })

  return true
}

function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

function validatePassword(password, hash) {
  return bcrypt.compareSync(password, hash)
}
