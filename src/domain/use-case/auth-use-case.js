const {
  ParametroInvalidoError,
  ParametroObrigatorioError,
} = require('../../../src/lib/error')

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

    if (!this.findUserByEmailRepository) {
      throw new ParametroObrigatorioError('Find User By Email Repository')
    }

    if (!this.findUserByEmailRepository.find) {
      throw new ParametroInvalidoError('Find User By Email Repository')
    }

    const user = await this.findUserByEmailRepository.find(email)

    if (!user) {
      return null
    }

    const isValid = await this.encrypter.compare(senha, user.senha)

    if (!isValid) {
      return null
    }

    await this.tokenGenerate.generate(user.id)
  }
}
