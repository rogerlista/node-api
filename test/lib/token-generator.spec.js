class TokenGenerator {
  async generate(id) {
    return null
  }
}

const makeSut = () => {
  return new TokenGenerator()
}

describe('Token Generator', () => {
  test('deve retornar null se generate retornar null', async () => {
    const sut = makeSut()

    const token = await sut.generate('qualquer_id')

    expect(token).toBeNull()
  })
})
