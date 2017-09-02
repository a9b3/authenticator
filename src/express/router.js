import { Router }                 from 'express'
import cors                       from 'cors'

import config                     from 'config'
import index                      from 'express/controllers/index'
import {asyncWrap}                from 'express/middlewares/tryCatchMiddleware'
import * as userController        from 'express/controllers/user'
import * as healthcheckController from 'express/controllers/healthcheck'

const router = new Router()

router.use(cors({
  origin: (origin, callback) => {
    const originIsInWhiteList = config.CORS_ORIGINS.some(re => re.test(origin))
    callback(!originIsInWhiteList && 'Cors Issue', originIsInWhiteList)
  },
}))

router.get(`/`, asyncWrap(index))

router.post('/api/authenticate', asyncWrap(userController.authenticate))
router.post('/api/verify', asyncWrap(userController.verify))
router.post('/api/register', asyncWrap(userController.register))
router.post('/api/invalidate', asyncWrap(userController.invalidate))
router.post('/api/facebookRegister', asyncWrap(userController.facebookRegister))
router.post('/api/facebookAuthenticate', asyncWrap(userController.facebookAuthenticate))

router.get('/healthCheck', asyncWrap(healthcheckController.healthcheck))

export default router
