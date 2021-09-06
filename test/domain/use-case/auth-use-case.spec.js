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
  findUserByEmailRepositorySpy.user = {
    id: 'qualquer_id',
    senha: 'qualquer_senha',
  }

  return findUserByEmailRepositorySpy
}

const makeEncrypterSpy = () => {
  class EncrypterSpy {
    async compare(senha, hashSenha) {
      this.senha = senha
      this.hashSenha = hashSenha

      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeSut = () => {
  const findUserByEmailRepositorySpy = makeFindUserByEmailRepositorySpy()
  const encrypterSpy = makeEncrypterSpy()
  const sut = new AuthUseCase(findUserByEmailRepositorySpy, encrypterSpy)

  return {
    sut,
    findUserByEmailRepositorySpy,
    encrypterSpy,
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
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.user = null

    const accessToken = await sut.auth({
      email: 'email_inexistente@mail.com',
      senha: 'qualquer_senha',
    })

    expect(accessToken).toBeNull()
  })

  test('deve retornar null se uma senha inválida for retornada', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false

    const accessToken = await sut.auth({
      email: 'email_valido@mail.com',
      senha: 'senha_incorreta',
    })

    expect(accessToken).toBeNull()
  })

  test('deve chamar Encrypter com os valores corretos', async () => {
    const { sut, encrypterSpy, findUserByEmailRepositorySpy } = makeSut()

    await sut.auth(credenciaisValidas)

    expect(encrypterSpy.senha).toBe(credenciaisValidas.senha)
    expect(encrypterSpy.hashSenha).toBe(findUserByEmailRepositorySpy.user.senha)
  })
})
