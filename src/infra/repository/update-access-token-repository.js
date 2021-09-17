const { Mongo } = require('../../lib/infra')
const { ParametroObrigatorioError } = require('../../lib/error')

module.exports = class UpdateAccessTokenRepository {
  async update(_id, accessToken) {
    if (!_id) {
      throw new ParametroObrigatorioError('ID')
    }
    if (!accessToken) {
      throw new ParametroObrigatorioError('Access Token')
    }
    const db = await Mongo.getDb()
    await db.collection('users').updateOne({ _id }, { $set: { accessToken } })
  }
}
