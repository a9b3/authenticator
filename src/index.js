const logger = require('logger').createLogger(__filename)
import { excludeFields } from 'js-functions'
import config            from 'config'
import server            from 'express/server'
import mongooseDb        from 'mongoose/db'
import * as redis        from 'redis/client'
import pkg               from '../package.json'

/*
 * Main entry point to the app. Do synchronous initialization stuff here e.g.
 * database initialization, etc.
 */
async function main() {
  // print out configuration information
  logger.info(`${pkg.name || 'name'} - ${pkg.version || 'version'}`)
  logger.info(``, excludeFields(config, ['FB_APP_ID', 'FB_APP_SECRET'], 'redacted'))

  await redis.init({host: config.REDIS_HOST, port: config.REDIS_PORT})
  await mongooseDb.connect(config.MONGO_URI)

  await server.listen(config.PORT)
  logger.info(`listening on port ${config.PORT}...`)
}

// Start it up
main().catch((err) => {
  logger.error(err)
  process.exit()
})
