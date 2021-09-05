const {
  ParametroInvalidoError,
  ParametroObrigatorioError,
} = require('../../lib/error')
const { HttpRequest } = require('../../lib')

module.exports = class LoginRouter {
  constructor(authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route(httpRequest) {
    try {
      const { email, senha } = httpRequest.body

      if (!email) {
        return HttpRequest.badRequest(new ParametroObrigatorioError('E-mail'))
      }

      if (!this.emailValidator.isValid(email)) {
        return HttpRequest.badRequest(new ParametroInvalidoError('E-mail'))
      }

      if (!senha) {
        return HttpRequest.badRequest(new ParametroObrigatorioError('Senha'))
      }

      const accessToken = await this.authUseCase.auth({ email, senha })

      if (!accessToken) {
        return HttpRequest.unauthorizedError()
      }

      return HttpRequest.ok({ accessToken })
    } catch (error) {
      // logar
      return HttpRequest.serverError()
    }
  }
}
