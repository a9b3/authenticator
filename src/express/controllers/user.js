import config             from 'config'
import * as userService   from 'domain/user'
import * as tokenService  from 'domain/token'
import * as facebookOauth from 'domain/oauth/facebook'

const reqHelper = {
  extractIp: (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress
  },

  extractUserAgent: (req) => {
    return req.headers['user-agent']
  },
}


export async function authenticate(req, res) {
  const jwt = await userService.authenticate({
    ...req.body,
    ip       : reqHelper.extractIp(req),
    userAgent: reqHelper.extractUserAgent(req),
  })

  if (config.ALLOW_SINGLE_DEVICE) {
    await invalidateAllOtherTokens({jwt})
  }

  res.send(jwt)
}

export async function register(req, res) {
  await userService.register(req.body)
  res.send(true)
}

export async function facebookRegister(req, res) {
  await facebookOauth.register(req.body)
  res.send(true)
}

export async function facebookAuthenticate(req, res) {
  const jwt = await facebookOauth.authenticate({
    ...req.body,
    ip       : reqHelper.extractIp(req),
    userAgent: reqHelper.extractUserAgent(req),
  })

  if (config.ALLOW_SINGLE_DEVICE) {
    await invalidateAllOtherTokens({jwt})
  }

  res.send(jwt)
}

export async function verify(req, res) {
  const result = await tokenService.verify(req.body)
  res.send(result)
}

export async function invalidate(req, res) {
  const result = await tokenService.invalidate(req.body)
  res.send(result)
}
