const { ParametroObrigatorioError } = require('../../../src/lib/error')

module.exports = class AuthUseCase {
  constructor({
    findUserByEmailRepository,
    encryption,
    tokenGenerator,
    updateAccessTokenRepository,
  } = {}) {
    this.findUserByEmailRepository = findUserByEmailRepository
    this.encryption = encryption
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth({ email, senha }) {
    if (!email) {
      throw new ParametroObrigatorioError('E-mail')
    }

    if (!senha) {
      throw new ParametroObrigatorioError('Senha')
    }

    const user = await this.findUserByEmailRepository.find(email)
    const isValid = user && (await this.encryption.compare(senha, user.senha))

    if (!isValid) {
      return null
    }

    const accessToken = await this.tokenGenerator.generate(user.id)
    await this.updateAccessTokenRepository.update(user.id, accessToken)

    return accessToken
  }
}
