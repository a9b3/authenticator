import userService        from 'services/user'
import * as facebookOauth from 'oauth/facebook'

export async function authenticate(req, res) {
  const result = await userService.authenticate(req.body)
  res.send(result)
}

export async function register(req, res) {
  const result = await userService.register(req.body)
  res.send(result)
}

export async function facebookRegister(req, res) {
  const result = await facebookOauth.register(req.body)
  res.send(result)
}

export async function facebookAuthenticate(req, res) {
  const result = await facebookOauth.authenticate(req.body)
  res.send(result)
}

export async function verify(req, res) {
  const result = await userService.verify(req.body)
  res.send(result)
}
