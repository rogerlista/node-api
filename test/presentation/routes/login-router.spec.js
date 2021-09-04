const LoginRouter = require('../../../src/presentation/routes/login-router')
const ParametroInvalidoError = require('../../../src/lib/error/parametro-invalido-error')
const ParametroObrigatorioError = require('../../../src/lib/error/parametro-obrigatorio-error')
const ServerError = require('../../../src/lib/error/server-error')
const UnauthorizedError = require('../../../src/lib/error/unauthorized-error')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCaseSpy()
  const emailValidatorSpy = makeEmailValidatorSpy()

  authUseCaseSpy.accessToken = 'token_valido'
  emailValidatorSpy.isEmailValid = true
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

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

  return new AuthUseCaseSpy()
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
      return this.isEmailValid
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
    expect(httpResponse.body).toEqual(new ParametroObrigatorioError('E-mail'))
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
    expect(httpResponse.body).toEqual(new ParametroObrigatorioError('Senha'))
  })

  test('deve retornar status code 500 se httpRequest não for passada', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('deve retornar status code 500 se httpRequest não conter um body', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.route({})

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
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
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('deve retornar o status code 200 quando as credenciais forem válidas', async () => {
    const { sut, authUseCaseSpy } = makeSut()

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('deve retornar o status code 500 se AuthUseCase não for passado', async () => {
    const sut = new LoginRouter()

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('deve retornar o status code 500 se AuthUseCase não tiver o método auth', async () => {
    const sut = new LoginRouter({})

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('deve retornar o status code 500 se AuthUseCase lançar uma exceção', async () => {
    const authUseCaseSpy = makeAuthUseCaseSpyWithError()
    const sut = new LoginRouter(authUseCaseSpy)

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('deve retornar o status code 400 se o email for inválido', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new ParametroInvalidoError('E-mail'))
  })
})
