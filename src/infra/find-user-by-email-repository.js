const { ParametroObrigatorioError } = require('../lib/error')

module.exports = class FindUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel
  }

  async find(email) {
    if (!email) {
      throw new ParametroObrigatorioError('E-mail')
    }
    return await this.userModel.findOne(
      {
        email,
      },
      {
        projection: {
          senha: true,
        },
      }
    )
  }
}
