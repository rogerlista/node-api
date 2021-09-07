const bcrypt = require('bcrypt')

const { ParametroObrigatorioError } = require('../../src/lib/error')

module.exports = class Encryption {
  async compare(data, hash) {
    if (!data) {
      throw new ParametroObrigatorioError('Value')
    }

    if (!hash) {
      throw new ParametroObrigatorioError('Hash')
    }

    const isValid = await bcrypt.compare(data, hash)
    return isValid
  }
}
