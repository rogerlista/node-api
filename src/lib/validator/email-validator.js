const validator = require('validator')
const { ParametroObrigatorioError } = require('../error')

module.exports = class EmailValidator {
  isValid(email) {
    if (!email) {
      throw new ParametroObrigatorioError('E-mail')
    }

    return validator.isEmail(email)
  }
}
