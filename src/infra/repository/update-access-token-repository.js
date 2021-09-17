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
    const userModel = await Mongo.getCollection('users')
    await userModel.updateOne({ _id }, { $set: { accessToken } })
  }
}
