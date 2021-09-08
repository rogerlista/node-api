const jwt = require('jsonwebtoken')

const { ParametroObrigatorioError } = require('../../src/lib/error')

class TokenGenerator {
  constructor(secret) {
    this.secret = secret
  }

  async generate(id) {
    if (!id) {
      throw new ParametroObrigatorioError('ID')
    }

    if (!this.secret) {
      throw new ParametroObrigatorioError('Secret')
    }

    return jwt.sign(id, this.secret)
  }
}

const makeSut = () => {
  jwt.token = 'qualquer_token'
  return new TokenGenerator('qualquer_string_de_seguranca')
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

  test('deve lançar uma exceção se o id não for informado', async () => {
    const sut = makeSut()

    const promise = sut.generate()

    await expect(promise).rejects.toThrow(new ParametroObrigatorioError('ID'))
  })

  test('deve lançar uma exceção se a secret não for informada', async () => {
    const sut = new TokenGenerator()

    const promise = sut.generate('qualquer_id')

    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('Secret')
    )
  })
})
