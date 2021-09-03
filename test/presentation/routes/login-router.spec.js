class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpRequest.serverError()
    }

    const { email, senha } = httpRequest.body

    if (!email) {
      return HttpRequest.badRequest('e-mail')
    }

    if (!senha) {
      return HttpRequest.badRequest('senha')
    }
  }
}

class HttpRequest {
  static badRequest(paramError) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramError),
    }
  }

  static serverError() {
    return {
      statusCode: 500,
    }
  }
}

class MissingParamError extends Error {
  constructor(paramError) {
    super(`${paramError} é obrigatório.`)
    this.name = this.constructor.name
  }
}

describe('Login Router', () => {
  test('deve retornar status code 400 se o e-mail não for informado', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        senha: 'qualquer-senha',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('e-mail'))
  })

  test('deve retornar status code 400 se a senha não for informada', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'qualquer_email@mail.com',
      },
    }

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('senha'))
  })

  test('deve retornar status code 500 se httpRequest não for passada', () => {
    const sut = new LoginRouter()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('deve retornar status code 500 se httpRequest não tiver um body', () => {
    const sut = new LoginRouter()

    const httpResponse = sut.route({})

    expect(httpResponse.statusCode).toBe(500)
  })
})
