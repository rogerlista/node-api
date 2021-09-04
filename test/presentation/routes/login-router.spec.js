const LoginRouter = require('../../../src/presentation/routes/login-router')
const ParametroObrigatorioError = require('../../../src/lib/error/parametro-obrigatorio-error')
const ServerError = require('../../../src/lib/error/server-error')
const UnauthorizedError = require('../../../src/lib/error/unauthorized-error')

const makeSut = () => {
  class AuthUseCaseSpy {
    async auth({ email, senha }) {
      this.email = email
      this.senha = senha
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy)

  return {
    sut,
    authUseCaseSpy,
  }
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
    expect(httpResponse.body).toEqual(new ParametroObrigatorioError('e-mail'))
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
    expect(httpResponse.body).toEqual(new ParametroObrigatorioError('senha'))
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
    const { sut } = makeSut()
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

  test('deve retornar o status code 500 se AuthUseCase não for passado', async () => {
    const sut = new LoginRouter()

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('deve retornar o status code 500 se AuthUserCase não tiver o método auth', async () => {
    const sut = new LoginRouter({})

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
