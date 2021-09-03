const ParametroObrigatorioError = require('./error/parametro-obrigatorio-error')

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
    }
  }
}
