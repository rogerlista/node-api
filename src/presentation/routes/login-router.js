const ParametroObrigatorioError = require('../../lib/error/parametro-obrigatorio-error')
const HttpRequest = require('../../lib/http-request')

module.exports = class LoginRouter {
  constructor(authUseCase) {
    this.authUseCase = authUseCase
  }

  async route(httpRequest) {
    try {
      const { email, senha } = httpRequest.body

      if (!email) {
        return HttpRequest.badRequest(new ParametroObrigatorioError('E-mail'))
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
