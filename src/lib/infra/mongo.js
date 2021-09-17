const { MongoClient } = require('mongodb')

module.exports = {
  async connect(url) {
    this.url = url
    this.connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    this.db = this.connection.db()
  },

  async disconnect() {
    await this.connection.close()
  },

  async getCollection(name) {
    return this.db.collection(name)
  },
}
