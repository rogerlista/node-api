const { ParametroObrigatorioError } = require('../../lib/error')

module.exports = class UpdateAccessTokenRepository {
  constructor(userModel) {
    this.userModel = userModel
  }

  async update(_id, accessToken) {
    if (!_id) {
      throw new ParametroObrigatorioError('ID')
    }
    if (!accessToken) {
      throw new ParametroObrigatorioError('Access Token')
    }
    await this.userModel.updateOne({ _id }, { $set: { accessToken } })
  }
}
