const { ParametroObrigatorioError } = require('../../../src/lib/error')

class AuthUseCase {
  async auth(email) {
    if (!email) {
      throw new ParametroObrigatorioError('E-mail')
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
})
