const HttpRequest = require('../../lib/http-request')

module.exports = class LoginRouter {
  constructor(authUseCase) {
    this.authUseCase = authUseCase
  }

  async route(httpRequest) {
    try {
      const { email, senha } = httpRequest.body

      if (!email) {
        return HttpRequest.badRequest('e-mail')
      }

      if (!senha) {
        return HttpRequest.badRequest('senha')
      }

      await this.authUseCase.auth({ email, senha })

      return HttpRequest.unauthorizedError()
    } catch (error) {
      // logar
      return HttpRequest.serverError()
    }
  }
}
