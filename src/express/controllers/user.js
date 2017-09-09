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
  const result = await userService.authenticate(req.body)
  res.send(result)
}

export async function register(req, res) {
  console.log(reqHelper.extractIp(req), reqHelper.extractUserAgent(req))

  // await userService.register(req.body)
  res.send(true)
}

export async function facebookRegister(req, res) {
  await facebookOauth.register(req.body)
  res.send(true)
}

export async function facebookAuthenticate(req, res) {
  const result = await facebookOauth.authenticate(req.body)
  res.send(result)
}

export async function verify(req, res) {
  const result = await tokenService.verify(req.body)
  res.send(result)
}

export async function invalidate(req, res) {
  const result = await tokenService.invalidate(req.body)
  res.send(result)
}
