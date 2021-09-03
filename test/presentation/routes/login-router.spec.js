const LoginRouter = require('../../../src/presentation/routes/login-router')
const ParametroObrigatorioError = require('../../../src/lib/error/parametro-obrigatorio-error')

const makeSut = () => {
  class AuthUseCase {
    auth({ email, senha }) {
      this.email = email
      this.senha = senha
    }
  }

  const authUseCase = new AuthUseCase()
  const sut = new LoginRouter(authUseCase)

  return {
    sut,
    authUseCase,
  }
}

describe('Login Router', () => {
  test('deve retornar status code 400 se o e-mail não for informado', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        senha: 'qualquer-senha',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new ParametroObrigatorioError('e-mail'))
  })

  test('deve retornar status code 400 se a senha não for informada', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'qualquer_email@mail.com',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new ParametroObrigatorioError('senha'))
  })

  test('deve retornar status code 500 se httpRequest não for passada', () => {
    const { sut } = makeSut()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('deve retornar status code 500 se httpRequest não conter um body', () => {
    const { sut } = makeSut()

    const httpResponse = sut.route({})

    expect(httpResponse.statusCode).toBe(500)
  })

  test('deve chamar AuthUseCase com os parâmetros corretos', () => {
    const { sut, authUseCase } = makeSut()
    const httpRequest = {
      body: {
        email: 'qualquer_email@mail.com',
        senha: 'qualquer_senha',
      },
    }

    sut.route(httpRequest)

    expect(authUseCase.email).toBe(httpRequest.body.email)
    expect(authUseCase.senha).toBe(httpRequest.body.senha)
  })
})
