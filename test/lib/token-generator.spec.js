const jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate(id) {
    return jwt.sign(id, 'qualquer_string_de_seguranca')
  }
}

const makeSut = () => {
  jwt.token = 'qualquer_token'
  return new TokenGenerator()
}

describe('Token Generator', () => {
  test('deve retornar null se generate retornar null', async () => {
    const sut = makeSut()
    jwt.token = null

    const token = await sut.generate('qualquer_id')

    expect(token).toBeNull()
  })

  test('deve retornar um token se generate retornar um token', async () => {
    const sut = makeSut()

    const token = await sut.generate('qualquer_id')

    expect(token).toBe('qualquer_token')
  })

  test('deve chamar generate com os valores corretos', async () => {
    const sut = makeSut()

    await sut.generate('qualquer_id')

    expect(jwt.id).toBe('qualquer_id')
    expect(jwt.secret).toBe('qualquer_string_de_seguranca')
  })
})
