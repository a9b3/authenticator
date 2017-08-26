import expect                  from 'expect'
import * as userService        from 'services/user'
import userModel               from 'mongoose/user'
import * as mongooseTestHelper from 'mongoose/testHelper'

describe('services/user', () => {
  beforeEach(mongooseTestHelper.setup)
  afterEach(mongooseTestHelper.teardown)

  describe('register', () => {
    it('error if email already exists', async () => {
      await(new userModel({
        email   : 'foo@example.com',
        password: '123',
        verified: false,
        id      : '1',
      })).save()

      let error
      try {
        await userService.register({
          email   : 'foo@example.com',
          password: '123',
        })
      } catch (err) {
        error = err
      }
      expect(error).toExist()
    })

    it('create user', async () => {
      const createdUser = await userService.register({
        email   : 'foo@example.com',
        password: '123',
      })

      expect(createdUser.id).toExist()
      expect(createdUser.password).toNotEqual('123')
      expect(createdUser.email).toBe('foo@example.com')
    })
  })

  describe('authenticate', () => {
    it('nonexistant email should not work', async () => {
      let error
      try {
        await userService.authenticate({email: 'foo', password: '123'})
      } catch (err) {
        error = err
      }
      expect(error).toExist()
    })

    it('incorrect password should not work', async () => {
      await userService.register({
        email   : 'foo@example.com',
        password: '123',
      })

      let error
      try {
        await userService.authenticate({email: 'foo@example.com', password: '1234'})
      } catch (err) {
        error = err
      }
      expect(error).toExist()
    })

    it('returns jwt', async () => {
      const testcase = {
        email   : 'foo@example.com',
        password: '123',
      }
      await userService.register(testcase)
      const jwt = await userService.authenticate(testcase)
      expect(jwt).toExist()
    })
  })

  describe('verify', () => {
    it('should be false if jwt is invalid', async () => {
      const result = await userService.verify({jwt: 'invalid_token'})
      expect(result).toBe(false)
    })

    it('should be true if jwt is valid', async () => {
      const testcase = {
        email   : 'foo@example.com',
        password: '123',
      }
      await userService.register(testcase)
      const jwt = await userService.authenticate(testcase)

      const result = await userService.verify({jwt})
      expect(result).toBe(true)
    })
  })
})
