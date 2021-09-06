const { ParametroObrigatorioError } = require('../../../src/lib/error')

module.exports = class AuthUseCase {
  constructor(findUserByEmailRepository, encrypter, tokenGenerate) {
    this.findUserByEmailRepository = findUserByEmailRepository
    this.encrypter = encrypter
    this.tokenGenerate = tokenGenerate
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

    const accessToken = await this.tokenGenerate.generate(user.id)

    return accessToken
  }
}
