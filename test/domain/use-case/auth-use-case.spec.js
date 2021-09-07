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
    senha: 'hashed_senha',
  }

  return findUserByEmailRepositorySpy
}

const makeFindUserByEmailRepositoryWithError = () => {
  class FindUserByEmailRepositorySpy {
    async find() {
      throw new Error()
    }
  }

  return new FindUserByEmailRepositorySpy()
}

const makeUpdateAccessTokenRepositorySpy = () => {
  class UpdateAccessTokenSpy {
    async update(userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }

  return new UpdateAccessTokenSpy()
}

const makeEncrypterSpy = () => {
  class EncrypterSpy {
    async compare(senha, hashedSenha) {
      this.senha = senha
      this.hashedSenha = hashedSenha

      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true

  return encrypterSpy
}

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare() {
      throw new Error()
    }
  }

  return new EncrypterSpy()
}

const makeTokenGeneratorSpy = () => {
  class TokenGeneratorSpy {
    async generate(userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'token_valido'

  return tokenGeneratorSpy
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async generate() {
      throw new Error()
    }
  }

  return new TokenGeneratorSpy()
}

const makeSut = () => {
  const findUserByEmailRepositorySpy = makeFindUserByEmailRepositorySpy()
  const encrypterSpy = makeEncrypterSpy()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepositorySpy()
  const sut = new AuthUseCase({
    findUserByEmailRepository: findUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
  })

  return {
    sut,
    findUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy,
  }
}

const credenciaisValidas = {
  email: 'email_valido@mail.com',
  senha: 'senha_valida',
}

describe('Auth Use Case', () => {
  test('deve lançar uma exceção se o método auth não receber um objeto', async () => {
    const { sut } = makeSut()

    const promise = sut.auth()

    await expect(promise).rejects.toThrow()
  })

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

  test('deve lançar uma exceção se AuthUseCase não receber um objeto', async () => {
    const sut = new AuthUseCase()

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })

  test('deve lançar uma exceção se FindUserByEmailRepository não for passado', async () => {
    const sut = new AuthUseCase({})

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })

  test('deve lançar uma exceção se FindUserByEmailRepository não tiver o método find', async () => {
    const sut = new AuthUseCase({})

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })

  test('deve lançar um exceção se FindUserByEmailRepository lançar uma exceção', async () => {
    const findUserByEmailRepositorySpy =
      makeFindUserByEmailRepositoryWithError()
    const sut = new AuthUseCase(findUserByEmailRepositorySpy)

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

  test('deve retornar null se uma senha inválida for informada', async () => {
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
    expect(encrypterSpy.hashedSenha).toBe(
      findUserByEmailRepositorySpy.user.senha
    )
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

  test('deve lançar um exceção se Encrypter lançar uma exceção', async () => {
    const encrypterSpy = makeEncrypterWithError()
    const sut = new AuthUseCase(
      makeFindUserByEmailRepositorySpy(),
      encrypterSpy
    )

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })

  test('deve chamar TokenGenerator com o ID de credencial válida', async () => {
    const { sut, findUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()

    await sut.auth(credenciaisValidas)

    expect(tokenGeneratorSpy.userId).toBe(findUserByEmailRepositorySpy.user.id)
  })

  test('deve lançar uma exceção se TokenGenerator não for passado', async () => {
    const sut = new AuthUseCase(
      makeFindUserByEmailRepositorySpy(),
      makeEncrypterSpy()
    )

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })

  test('deve lançar uma exceção se TokenGenerator não tiver o método generate', async () => {
    const sut = new AuthUseCase(
      makeFindUserByEmailRepositorySpy(),
      makeEncrypterSpy(),
      {}
    )

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })

  test('deve lançar um exceção se TokenGenerator lançar uma exceção', async () => {
    const tokenGeneratorSpy = makeTokenGeneratorWithError()
    const sut = new AuthUseCase(
      makeFindUserByEmailRepositorySpy(),
      makeEncrypterSpy(),
      tokenGeneratorSpy
    )

    const promise = sut.auth(credenciaisValidas)

    await expect(promise).rejects.toThrow()
  })

  test('deve retornar um accessToken se as credenciais forem válidas', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()

    const accessToken = await sut.auth(credenciaisValidas)

    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  test('deve chamar UpdateAccessTokenRepository com os valores corretos', async () => {
    const {
      sut,
      findUserByEmailRepositorySpy,
      updateAccessTokenRepositorySpy,
    } = makeSut()

    const accessToken = await sut.auth(credenciaisValidas)

    expect(updateAccessTokenRepositorySpy.userId).toBe(
      findUserByEmailRepositorySpy.user.id
    )
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(accessToken)
  })
})
