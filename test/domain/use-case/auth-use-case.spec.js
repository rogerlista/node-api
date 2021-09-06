const {
  ParametroInvalidoError,
  ParametroObrigatorioError,
} = require('../../../src/lib/error')

class AuthUseCase {
  constructor(findUserByEmailRepository) {
    this.findUserByEmailRepository = findUserByEmailRepository
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

    await this.findUserByEmailRepository.find(email)
  }
}

const makeSut = () => {
  class FindUserByEmailRepository {
    find(email) {
      this.email = email
    }
  }

  const findUserByEmailRepository = new FindUserByEmailRepository()
  const sut = new AuthUseCase(findUserByEmailRepository)

  return {
    sut,
    findUserByEmailRepository,
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
    const { sut, findUserByEmailRepository } = makeSut()

    await sut.auth(credenciaisValidas)

    expect(findUserByEmailRepository.email).toBe('email_valido@mail.com')
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
})
