import mongooseDb from 'mongoose/db'
import config     from 'config'

export async function setup() {
  await mongooseDb.connect(config.MONGO_URI)
  await mongooseDb.dangerouslyClearDb()
}

export async function teardown() {
  await mongooseDb.dangerouslyClearDb()
}
