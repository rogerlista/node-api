const { ParametroObrigatorioError } = require('../../../src/lib/error')

class AuthUseCase {
  async auth({ email, senha }) {
    if (!email) {
      throw new ParametroObrigatorioError('E-mail')
    }

    if (!senha) {
      throw new ParametroObrigatorioError('Senha')
    }
  }
}

const makeSut = () => {
  return new AuthUseCase()
}

describe('Auth Use Case', () => {
  test('deve lançar uma exceção se o e-mail não for informado', async () => {
    const sut = makeSut()

    const promise = sut.auth({})

    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('E-mail')
    )
  })

  test('deve lançar uma exceção se a senha não for informada', async () => {
    const sut = makeSut()

    const promise = sut.auth({ email: 'email_valido@mail.com' })

    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('Senha')
    )
  })
})
