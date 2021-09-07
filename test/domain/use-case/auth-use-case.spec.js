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
  class UpdateAccessTokenRepositorySpy {
    async update(userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }

  return new UpdateAccessTokenRepositorySpy()
}

const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepositorySpy {
    async update() {
      throw new Error()
    }
  }

  return new UpdateAccessTokenRepositorySpy()
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

  test('deve chamar TokenGenerator com o ID de credencial válida', async () => {
    const { sut, findUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()

    await sut.auth(credenciaisValidas)

    expect(tokenGeneratorSpy.userId).toBe(findUserByEmailRepositorySpy.user.id)
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

  test('deve lançar uma exceção se alguma das dependências forem inválidas', async () => {
    const invalid = {}
    const findUserByEmailRepository = makeFindUserByEmailRepositorySpy()
    const encrypter = makeEncrypterSpy()
    const tokenGenerator = makeTokenGeneratorSpy()
    const updateAccessTokenRepository = makeUpdateAccessTokenRepositorySpy()
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({
        findUserByEmailRepository: null,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository: invalid,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter: null,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter: invalid,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter,
        tokenGenerator: null,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: null,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: invalid,
      })
    )

    for (const sut of suts) {
      const promise = sut.auth(credenciaisValidas)
      await expect(promise).rejects.toThrow()
    }
  })

  test('deve repassar a exceção se qualquer dependência lançar uma exceção', async () => {
    const findUserByEmailRepository = makeFindUserByEmailRepositorySpy()
    const encrypter = makeEncrypterSpy()
    const tokenGenerator = makeTokenGeneratorSpy()
    const updateAccessTokenRepository = makeUpdateAccessTokenRepositorySpy()
    const suts = [].concat(
      new AuthUseCase({
        findUserByEmailRepository: makeFindUserByEmailRepositoryWithError(),
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter: makeEncrypterWithError(),
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError(),
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError(),
      })
    )

    for (const sut of suts) {
      const promise = sut.auth(credenciaisValidas)
      await expect(promise).rejects.toThrow()
    }
  })
})
