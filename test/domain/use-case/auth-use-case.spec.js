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

const makeEncryptionSpy = () => {
  class EncryptionSpy {
    async compare(senha, hashedSenha) {
      this.senha = senha
      this.hashedSenha = hashedSenha

      return this.isValid
    }
  }

  const encryptionSpy = new EncryptionSpy()
  encryptionSpy.isValid = true

  return encryptionSpy
}

const makeEncryptionWithError = () => {
  class EncryptionSpy {
    async compare() {
      throw new Error()
    }
  }

  return new EncryptionSpy()
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
  const encryptionSpy = makeEncryptionSpy()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepositorySpy()
  const sut = new AuthUseCase({
    findUserByEmailRepository: findUserByEmailRepositorySpy,
    encryption: encryptionSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
  })

  return {
    sut,
    findUserByEmailRepositorySpy,
    encryptionSpy,
    tokenGeneratorSpy,
    updateAccessTokenRepositorySpy,
  }
}

const credenciaisValidas = {
  email: 'email_valido@mail.com',
  senha: 'senha_valida',
}

describe('Auth Use Case', () => {
  test('deve lan??ar uma exce????o se o m??todo auth n??o receber um objeto', async () => {
    const { sut } = makeSut()

    const promise = sut.auth()

    await expect(promise).rejects.toThrow()
  })

  test('deve lan??ar uma exce????o se o e-mail n??o for informado', async () => {
    const { sut } = makeSut()

    const promise = sut.auth({})

    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('E-mail')
    )
  })

  test('deve lan??ar uma exce????o se a senha n??o for informada', async () => {
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

  test('deve retornar null se uma senha inv??lida for informada', async () => {
    const { sut, encryptionSpy } = makeSut()
    encryptionSpy.isValid = false

    const accessToken = await sut.auth({
      email: 'email_valido@mail.com',
      senha: 'senha_incorreta',
    })

    expect(accessToken).toBeNull()
  })

  test('deve chamar Encryption com os valores corretos', async () => {
    const { sut, encryptionSpy, findUserByEmailRepositorySpy } = makeSut()

    await sut.auth(credenciaisValidas)

    expect(encryptionSpy.senha).toBe(credenciaisValidas.senha)
    expect(encryptionSpy.hashedSenha).toBe(
      findUserByEmailRepositorySpy.user.senha
    )
  })

  test('deve chamar TokenGenerator com o ID de credencial v??lida', async () => {
    const { sut, findUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()

    await sut.auth(credenciaisValidas)

    expect(tokenGeneratorSpy.userId).toBe(findUserByEmailRepositorySpy.user._id)
  })

  test('deve retornar um accessToken se as credenciais forem v??lidas', async () => {
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
      findUserByEmailRepositorySpy.user._id
    )
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(accessToken)
  })

  test('deve lan??ar uma exce????o se alguma das depend??ncias forem inv??lidas', async () => {
    const invalid = {}
    const findUserByEmailRepository = makeFindUserByEmailRepositorySpy()
    const encryption = makeEncryptionSpy()
    const tokenGenerator = makeTokenGeneratorSpy()
    const updateAccessTokenRepository = makeUpdateAccessTokenRepositorySpy()
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({
        findUserByEmailRepository: null,
        encryption,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository: invalid,
        encryption,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encryption: null,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encryption: invalid,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encryption,
        tokenGenerator: null,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encryption,
        tokenGenerator: invalid,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encryption,
        tokenGenerator,
        updateAccessTokenRepository: null,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encryption,
        tokenGenerator,
        updateAccessTokenRepository: invalid,
      })
    )

    for (const sut of suts) {
      const promise = sut.auth(credenciaisValidas)
      await expect(promise).rejects.toThrow()
    }
  })

  test('deve repassar a exce????o se qualquer depend??ncia lan??ar uma exce????o', async () => {
    const findUserByEmailRepository = makeFindUserByEmailRepositorySpy()
    const encryption = makeEncryptionSpy()
    const tokenGenerator = makeTokenGeneratorSpy()
    const updateAccessTokenRepository = makeUpdateAccessTokenRepositorySpy()
    const suts = [].concat(
      new AuthUseCase({
        findUserByEmailRepository: makeFindUserByEmailRepositoryWithError(),
        encryption,
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encryption: makeEncryptionWithError(),
        tokenGenerator,
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encryption,
        tokenGenerator: makeTokenGeneratorWithError(),
        updateAccessTokenRepository,
      }),
      new AuthUseCase({
        findUserByEmailRepository,
        encryption,
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
