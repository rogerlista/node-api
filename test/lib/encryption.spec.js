class Encryption {
  async compare(valor, hash) {
    return true
  }
}

describe('Encryption', () => {
  test('deve retornar true se Encryption retornar true', async () => {
    const sut = new Encryption()

    const isValid = await sut.compare('qualquer_valor', 'hash')

    expect(isValid).toBe(true)
  })
})
