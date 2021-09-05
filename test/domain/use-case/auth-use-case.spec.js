const { ParametroObrigatorioError } = require('../../../src/lib/error')

class AuthUseCase {
  async auth(email, senha) {
    if (!email) {
      throw new ParametroObrigatorioError('E-mail')
    }

    if (!senha) {
      throw new ParametroObrigatorioError('Senha')
    }
  }
}

describe('Auth Use Case', () => {
  test('deve lançar uma exceção se o e-mail não for informado', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth()

    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('E-mail')
    )
  })

  test('deve lançar uma exceção se a senha não for informada', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth('email_valido@mail.com')

    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('Senha')
    )
  })
})
