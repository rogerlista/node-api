const { AuthUseCase } = require('../../../src/domain/use-case')
const {
  ParametroInvalidoError,
  ParametroObrigatorioError,
} = require('../../../src/lib/error')

const makeFindUserByEmailRepositorySpy = () => {
  class FindUserByEmailRepositorySpy {
    async find(email) {
      this.email = email
      return this.user
    }
  }

  const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()

  return findUserByEmailRepositorySpy
}

const makeSut = () => {
  const findUserByEmailRepositorySpy = makeFindUserByEmailRepositorySpy()
  const sut = new AuthUseCase(findUserByEmailRepositorySpy)

  return {
    sut,
    findUserByEmailRepositorySpy,
  }
}

const credenciaisValidas = {
  email: 'email_valido@mail.com',
  senha: 'senha_valida',
}

describe('Auth Use Case', () => {
  test('deve lançar uma exceção se o e-mail não for informado', async () => {
    const { sut } = makeSut()

    const promise = sut.auth({})

    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('E-mail')
    )
  })

  test('deve lançar uma exceção se a senha não for informada', async () => {
    const { sut } = makeSut()

    const promise = sut.auth({ email: 'email_valido@mail.com' })

    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('Senha')
    )
  })

  test('deve chamar FindUserByEmailRepository com um e-mail correto', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()

    await sut.auth(credenciaisValidas)

    expect(findUserByEmailRepositorySpy.email).toBe('email_valido@mail.com')
  })

  test('deve lançar uma exceção se FindUserByEmailRepository não for passado', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('Find User By Email Repository')
    )
  })

  test('deve lançar uma exceção se FindUserByEmailRepository não tiver o método find', async () => {
    const sut = new AuthUseCase({})

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow(
      new ParametroInvalidoError('Find User By Email Repository')
    )
  })

  test('deve retornar null se FindUserByEmailRepository receber um e-mail inexistente', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth({
      email: 'email_inexistente@mail.com',
      senha: 'qualquer_senha',
    })

    expect(accessToken).toBeNull()
  })
})
