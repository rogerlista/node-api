const { env } = require('../config')
const { LoginRouter } = require('../../presentation/routes')
const { AuthUseCase } = require('../../domain/use-case')
const { EmailValidator } = require('../../lib/validator')
const {
  FindUserByEmailRepository,
  UpdateAccessTokenRepository,
} = require('../../infra/repository')
const { Encryption, TokenGenerator } = require('../../lib')

module.exports = class LoginRouterCompose {
  static compose() {
    const tokenGenerator = new TokenGenerator(env.tokenSecret)
    const encryption = new Encryption()
    const findUserByEmailRepository = new FindUserByEmailRepository()
    const updateAccessTokenRepository = new UpdateAccessTokenRepository()
    const emailValidator = new EmailValidator()
    const authUseCase = new AuthUseCase({
      findUserByEmailRepository,
      updateAccessTokenRepository,
      encryption,
      tokenGenerator,
    })
    return new LoginRouter({
      authUseCase,
      emailValidator,
    })
  }
}
