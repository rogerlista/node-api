const ParametroInvalidoError = require('./parametro-invalido-error')
const ParametroObrigatorioError = require('./parametro-obrigatorio-error')
const ServerError = require('./server-error')
const UnauthorizedError = require('./unauthorized-error')

module.exports = {
  ParametroInvalidoError,
  ParametroObrigatorioError,
  ServerError,
  UnauthorizedError,
}
