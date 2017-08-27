import invariant        from 'invariant'
import axios            from 'axios'
import qs               from 'qs'
import uuid             from 'uuid'

import config           from 'config'
import * as userService from 'services/user'
import * as token       from 'token'
import * as userModel   from 'mongoose/user'

export async function register({code, redirectUri}) {
  const {email, id} = await exchangeCode({code, redirectUri})
  return userService.register({email, password: uuid.v4(), facebook: {id}})
}

export async function authenticate({code, redirectUri}) {
  const {email, expiresIn} = await exchangeCode({code, redirectUri})

  const found = userModel.findOne({email})
  if (!found) {
    throw new Error('User not found for given email.')
  }

  return await token.create({
    email,
    id : found.id,
    ttl: expiresIn,
  })
}

async function exchangeCode({code, redirectUri}) {
  invariant(code, `'code' must be provided.`)
  invariant(redirectUri, `'redirectUri' must be provided.`)

  const result = await codeForAccessToken({code, redirectUri})
  const data = await debugAccessToken({accessToken: result.access_token})
  const userInfo = await getUserInfo({accessToken: result.access_token, id: data.user_id})
  return {
    ...userInfo,
    accessToken: result.access_token,
    expiresIn  : result.expires_in,
  }
}

/**
 * {access_token, token_type, expires_in (seconds)}
 */
async function codeForAccessToken({code, redirectUri}) {
  const querystring = qs.stringify({
    client_id    : config.FB_APP_ID,
    client_secret: config.FB_APP_SECRET,
    redirect_uri : redirectUri,
    code,
  })
  const {data} = await axios.get(`https://graph.facebook.com/v2.10/oauth/access_token?${querystring}`)
  return data
}

/*
 * { app_id: '115229942540274',
     application: 'Hello',
     expires_at: 1508980863,
     is_valid: true,
     issued_at: 1503796863,
     scopes: [ 'user_about_me', 'email', 'public_profile' ],
     user_id: '10211876340198113' }
 */
async function debugAccessToken({accessToken}) {
  const querystring = qs.stringify({
    input_token : accessToken,
    access_token: config.FB_APP_ID + '|' + config.FB_APP_SECRET,
  })
  const {data: {data}} = await axios.get(`https://graph.facebook.com/debug_token?${querystring}`)
  return data
}

/**
 * @returns {object} {email, id}
 */
async function getUserInfo({
  accessToken,
  id,
}) {
  const querystring = qs.stringify({
    fields      : 'email',
    access_token: accessToken,
  })
  const {data} = await axios.get(`https://graph.facebook.com/v2.10/${id}?${querystring}`)
  return data
}
