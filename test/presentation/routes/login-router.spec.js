const { LoginRouter } = require('../../../src/presentation/routes')
const {
  ParametroInvalidoError,
  ParametroObrigatorioError,
  ServerError,
  UnauthorizedError,
} = require('../../../src/lib/error')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCaseSpy()
  const emailValidatorSpy = makeEmailValidatorSpy()
  const sut = new LoginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy,
  })

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy,
  }
}

const makeAuthUseCaseSpy = () => {
  class AuthUseCaseSpy {
    async auth({ email, senha }) {
      this.email = email
      this.senha = senha

      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'token_valido'

  return authUseCaseSpy
}

const makeAuthUseCaseSpyWithError = () => {
  class AuthUseCaseSpy {
    async auth() {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

const makeEmailValidatorSpy = () => {
  class EmailValidatorSpy {
    isValid(email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true

  return emailValidatorSpy
}

const makeEmailValidatorSpyWithError = () => {
  class EmailValidatorSpy {
    isValid() {
      throw new Error()
    }
  }

  return new EmailValidatorSpy()
}

const httpRequest = {
  body: {
    email: 'email_valido@mail.com',
    senha: 'senha_valida',
  },
}

describe('Login Router', () => {
  test('deve retornar status code 400 se o e-mail não for informado', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        senha: 'senha_valida',
      },
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(
      new ParametroObrigatorioError('E-mail').message
    )
  })

  test('deve retornar status code 400 se a senha não for informada', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email_valido@mail.com',
      },
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(
      new ParametroObrigatorioError('Senha').message
    )
  })

  test('deve retornar status code 500 se httpRequest não for passada', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('deve retornar status code 500 se httpRequest não conter um body', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.route({})

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('deve chamar AuthUseCaseSpy com os parâmetros corretos', async () => {
    const { sut, authUseCaseSpy } = makeSut()

    await sut.route(httpRequest)

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.senha).toBe(httpRequest.body.senha)
  })

  test('deve retornar status code 401 se as credencias informadas forem inválidas', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'email_invalido@mail.com',
        senha: 'senha_invalida',
      },
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body.error).toBe(new UnauthorizedError().message)
  })

  test('deve retornar o status code 200 quando as credenciais forem válidas', async () => {
    const { sut, authUseCaseSpy } = makeSut()

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('deve chamar EmailValidator com o email correto', async () => {
    const { sut, emailValidatorSpy } = makeSut()

    await sut.route(httpRequest)

    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })

  test('deve retornar o status code 400 se o email for inválido', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(
      new ParametroInvalidoError('E-mail').message
    )
  })

  test('deve lançar uma exceção se qualquer uma das dependências forem inválidas', async () => {
    const invalid = {}
    const authUseCase = makeAuthUseCaseSpy()
    const emailValidator = makeEmailValidatorSpy()
    const suts = [].concat(
      new LoginRouter(),
      new LoginRouter({}),
      new LoginRouter({
        authUseCase: null,
        emailValidator,
      }),
      new LoginRouter({
        authUseCase: invalid,
        emailValidator,
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: null,
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: invalid,
      })
    )
    for (const sut of suts) {
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })

  test('deve repassar a exceção se qualquer dependência lançar uma exceção', async () => {
    const authUseCase = makeAuthUseCaseSpy()
    const emailValidator = makeEmailValidatorSpy()
    const suts = [].concat(
      new LoginRouter({
        authUseCase: makeAuthUseCaseSpyWithError(),
        emailValidator,
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: makeEmailValidatorSpyWithError(),
      })
    )
    for (const sut of suts) {
      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.error).toBe(new ServerError().message)
    }
  })
})
