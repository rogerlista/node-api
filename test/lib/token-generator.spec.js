const jwt = require('jsonwebtoken')

const { TokenGenerator } = require('../../src/lib')
const { ParametroObrigatorioError } = require('../../src/lib/error')

const makeSut = () => {
  return new TokenGenerator('qualquer_string_de_seguranca')
}

jest.mock('jsonwebtoken', () => ({
  token: 'qualquer_token',

  sign(payload, secret) {
    this.payload = payload
    this.secret = secret
    return this.token
  },
}))

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

    expect(token).toBe(jwt.token)
  })

  test('deve chamar generate com os valores corretos', async () => {
    const sut = makeSut()

    await sut.generate('qualquer_id')

    expect(jwt.payload).toEqual({ _id: 'qualquer_id' })
    expect(jwt.secret).toBe(sut.secret)
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
