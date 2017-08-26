import userService from 'services/user'

export async function authenticate(req, res) {
  const result = await userService.authenticate(req.body)
  res.send(result)
}

export async function register(req, res) {
  const result = await userService.register(req.body)
  res.send(result)
}

export async function registerOauth(req, res) {
  const result = await userService.registerOauth(req.body)
  res.send(result)
}

export async function verify(req, res) {
  const result = await userService.verify(req.body)
  res.send(result)
}
