import mongoose from 'mongoose'
mongoose.Promise = global.Promise

const _EVENTS = {
  CONNECTED: 'connected',
  ERROR    : 'error',
}

class DB {
  connect(url) {
    return new Promise((resolve, reject) => {
      mongoose.connect(url, {
        useMongoClient: true,
      })

      mongoose.connection.on(_EVENTS.CONNECTED, resolve)
      mongoose.connection.on(_EVENTS.ERROR, reject)
    })
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      mongoose.disconnect(err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  dangerouslyClearDb() {
    return mongoose.connection.db.dropDatabase()
  }
}

export default new DB()
