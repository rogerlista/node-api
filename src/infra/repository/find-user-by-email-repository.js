const { Mongo } = require('../../lib/infra')
const { ParametroObrigatorioError } = require('../../lib/error')

module.exports = class FindUserByEmailRepository {
  async find(email) {
    if (!email) {
      throw new ParametroObrigatorioError('E-mail')
    }
    const userModel = await Mongo.getCollection('users')
    return await userModel.findOne(
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
