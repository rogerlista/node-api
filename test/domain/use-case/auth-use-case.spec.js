const { AuthUseCase } = require('../../../src/domain/use-case')
const { ParametroObrigatorioError } = require('../../../src/lib/error')

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

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGenerateSpy = new TokenGeneratorSpy()
  tokenGenerateSpy.accessToken = 'token_valido'

  return tokenGenerateSpy
}

const makeSut = () => {
  const findUserByEmailRepositorySpy = makeFindUserByEmailRepositorySpy()
  const encrypterSpy = makeEncrypterSpy()
  const tokenGenerateSpy = makeTokenGenerator()
  const sut = new AuthUseCase(
    findUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGenerateSpy
  )

  return {
    sut,
    findUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGenerateSpy,
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

    await expect(promise).rejects.toThrow()
  })

  test('deve lançar uma exceção se FindUserByEmailRepository não tiver o método find', async () => {
    const sut = new AuthUseCase({})

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
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

  test('deve lançar uma exceção se Encrypter não for passado', async () => {
    const sut = new AuthUseCase(makeFindUserByEmailRepositorySpy())

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })

  test('deve lançar uma exceção se Encrypter não tiver o método compare', async () => {
    const sut = new AuthUseCase(makeFindUserByEmailRepositorySpy(), {})

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })

  test('deve chamar TokenGenerator com o ID de credencial válida', async () => {
    const { sut, findUserByEmailRepositorySpy, tokenGenerateSpy } = makeSut()

    await sut.auth(credenciaisValidas)

    expect(tokenGenerateSpy.userId).toBe(findUserByEmailRepositorySpy.user.id)
  })

  test('deve lançar uma exceção se TokenGenerate não for passado', async () => {
    const sut = new AuthUseCase(
      makeFindUserByEmailRepositorySpy(),
      makeEncrypterSpy()
    )

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })

  test('deve lançar uma exceção se TokenGenerate não tiver o método generate', async () => {
    const sut = new AuthUseCase(
      makeFindUserByEmailRepositorySpy(),
      makeEncrypterSpy(),
      {}
    )

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })
})
