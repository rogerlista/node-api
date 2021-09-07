const bcrypt = require('bcrypt')

class Encryption {
  async compare(valor, hash) {
    const isValid = await bcrypt.compare(valor, hash)
    return isValid
  }
}

const makeSut = () => {
  return new Encryption()
}

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
})
