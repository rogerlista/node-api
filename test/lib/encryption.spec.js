const bcrypt = require('bcrypt')

const { Encryption } = require('../../src/lib')
const { ParametroObrigatorioError } = require('../../src/lib/error')

const makeSut = () => {
  return new Encryption()
}

jest.mock('bcrypt', () => ({
  isValid: true,

  async compare(data, hash) {
    this.data = data
    this.hash = hash
    return this.isValid
  },
}))

describe('Encryption', () => {
  test('deve retornar true se Encryption retornar true', async () => {
    const sut = makeSut()

    const isValid = await sut.compare('qualquer_valor', 'hash')

    expect(isValid).toBe(true)
  })

  test('deve retornar false se Encryption retornar false', async () => {
    const sut = makeSut()
    bcrypt.isValid = false

    const isValid = await sut.compare('qualquer_valor_invalido', 'hash')

    expect(isValid).toBe(false)
  })

  test('deve chamar Encryption com os valores corretos', async () => {
    const sut = makeSut()

    await sut.compare('qualquer_valor', 'qualquer_hash')

    expect(bcrypt.data).toBe('qualquer_valor')
    expect(bcrypt.hash).toBe('qualquer_hash')
  })

  test('deve lançar uma exceção se o valor não for informado', async () => {
    const sut = makeSut()

    const promise = sut.compare()

    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('Value')
    )
  })

  test('deve lançar uma exceção se o hash não for informado', async () => {
    const sut = makeSut()

    const promise = sut.compare('qualquer_valor')

    await expect(promise).rejects.toThrow(new ParametroObrigatorioError('Hash'))
  })
})
