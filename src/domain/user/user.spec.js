import expect           from 'expect'
import * as userService from 'domain/user'
import userModel        from 'mongoose/user'
import * as testHelper  from 'helpers/testHelper'

describe('domain/user', () => {
  beforeEach(testHelper.setup)
  afterEach(testHelper.teardown)

  describe('register', () => {
    it('error if email already exists', async () => {
      await(new userModel({
        email   : 'foo@example.com',
        password: '123',
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

  describe('changePassword', () => {
    it('oldPassword should match old password', async () => {
      const createdUser = await userService.register({
        email   : 'foo@example.com',
        password: '123',
      })

      let error
      try {
        await userService.changePassword({
          id         : createdUser.id,
          oldPassword: '1234',
          newPassword: '1234',
        })
      } catch (err) {
        error = err
      }
      expect(error).toExist()
    })

    it('should work', async () => {
      const createdUser = await userService.register({
        email   : 'foo@example.com',
        password: '123',
      })

      await userService.changePassword({
        id         : createdUser.id,
        oldPassword: '123',
        newPassword: '1234',
      })

      const updatedUser = userModel.findOne({id: createdUser.id})
      expect(updatedUser.password).toNotEqual(createdUser.password)
    })
  })
})
