const { ParametroObrigatorioError } = require('../../../src/lib/error')

module.exports = class AuthUseCase {
  constructor({ findUserByEmailRepository, encrypter, tokenGenerator }) {
    this.findUserByEmailRepository = findUserByEmailRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async auth({ email, senha }) {
    if (!email) {
      throw new ParametroObrigatorioError('E-mail')
    }

    if (!senha) {
      throw new ParametroObrigatorioError('Senha')
    }

    const user = await this.findUserByEmailRepository.find(email)
    const isValid = user && (await this.encrypter.compare(senha, user.senha))

    if (!isValid) {
      return null
    }

    const accessToken = await this.tokenGenerator.generate(user.id)

    return accessToken
  }
}
