const logger = require('services/logger').createLogger(__filename)
import config     from 'config'
import server     from 'express/server'
import pkg        from '../package.json'
import mongooseDb from 'mongoose/db'

/*
 * Main entry point to the app. Do synchronous initialization stuff here e.g.
 * database initialization, etc.
 */
async function main() {
  // print out configuration information
  logger.info(`${pkg.name || 'name'} - ${pkg.version || 'version'}`)
  logger.info(``, config)

  await mongooseDb.connect(config.MONGO_URI)
  logger.info(`connected mongo...`)

  await server.listen(config.PORT)
  logger.info(`listening on port ${config.PORT}...`)
}

// Start it up
main().catch((err) => {
  logger.error(err)
  process.exit()
})
