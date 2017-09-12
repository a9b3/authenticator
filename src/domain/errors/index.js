/*
 * Group all the error types thrown by the app in this file.
 */

export function AuthorizationError(message) {
  const error = new Error(message || `Authorization error.`)
  error.message = message || `Authorization error.`
  error.status = 401
  return error
}

export function GenericError(message) {
  const error = new Error(message)
  error.message = message
  error.status = 500
  return error
}
