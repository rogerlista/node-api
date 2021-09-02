class LoginRouter {
  route(httpRequest) {
    const { email, senha } = httpRequest.body

    if (!email || !senha) {
      return {
        statusCode: 400,
      }
    }
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
  })
})
