const HttpRequest = require('../../lib/http-request')

module.exports = class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpRequest.serverError()
    }

    const { email, senha } = httpRequest.body

    if (!email) {
      return HttpRequest.badRequest('e-mail')
    }

    if (!senha) {
      return HttpRequest.badRequest('senha')
    }
  }
}
