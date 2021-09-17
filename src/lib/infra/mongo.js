const { MongoClient } = require('mongodb')

module.exports = {
  async connect(url, dbName) {
    this.url = url
    this.dbName = dbName
    this.connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    this.db = this.connection.db(dbName)
  },

  async disconnect() {
    await this.connection.close()
  },

  async getCollection(name) {
    return this.db.collection(name)
  },
}
