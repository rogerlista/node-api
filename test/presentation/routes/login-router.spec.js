class LoginRouter {
  route(httpRequest) {
    return {
      statusCode: 400,
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
})
