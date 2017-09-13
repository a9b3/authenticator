import expect            from 'expect'
import * as tokenService from 'token'
import * as userService  from 'user'
import * as testHelper   from 'helpers/testHelper'

describe('token', () => {
  beforeEach(testHelper.setup)
  afterEach(testHelper.teardown)

  describe('verify', () => {
    it('should be false if jwt is invalid', async () => {
      let error
      try {
        const result = await tokenService.verify({jwt: 'invalid_token'})
      } catch (err) {
        error = err
      }
      expect(error).toExist()
    })

    it('should be true if jwt is valid', async () => {
      const testcase = {
        email   : 'foo@example.com',
        password: '123',
      }
      await userService.register(testcase)
      const jwt = await userService.authenticate(testcase)

      const result = await tokenService.verify({jwt})
      expect(result).toBe(true)
    })
  })
})
