const ParametroObrigatorioError = require('./error/parametro-obrigatorio-error')
const ServerError = require('./error/server-error')
const UnauthorizedError = require('./error/unauthorized-error')

module.exports = class HttpRequest {
  static badRequest(nomeDoParametro) {
    return {
      statusCode: 400,
      body: new ParametroObrigatorioError(nomeDoParametro),
    }
  }

  static serverError() {
    return {
      statusCode: 500,
      body: new ServerError(),
    }
  }

  static unauthorizedError() {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    }
  }
}
