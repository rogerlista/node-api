const bcrypt = require('bcrypt')

const { ParametroObrigatorioError } = require('../../src/lib/error')

module.exports = class Encryption {
  async compare(valor, hash) {
    if (!valor) {
      throw new ParametroObrigatorioError('Senha')
    }

    if (!hash) {
      throw new ParametroObrigatorioError('Hash')
    }

    const isValid = await bcrypt.compare(valor, hash)
    return isValid
  }
}
