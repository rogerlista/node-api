const { Mongo } = require('../../lib/infra')
const { ParametroObrigatorioError } = require('../../lib/error')

module.exports = class FindUserByEmailRepository {
  async find(email) {
    if (!email) {
      throw new ParametroObrigatorioError('E-mail')
    }
    const db = await Mongo.getDb()
    return await db.collection('users').findOne(
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
