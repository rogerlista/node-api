const jwt = require('jsonwebtoken')

const { ParametroObrigatorioError } = require('../../src/lib/error')

module.exports = class TokenGenerator {
  constructor(secret) {
    this.secret = secret
  }

  async generate(id) {
    if (!id) {
      throw new ParametroObrigatorioError('ID')
    }

    if (!this.secret) {
      throw new ParametroObrigatorioError('Secret')
    }

    return jwt.sign(id, this.secret)
  }
}
