const makeSut = () => {
  class FindUserByEmailRepository {
    async find() {
      return null
    }
  }

  return new FindUserByEmailRepository()
}

describe('FindUserByEmailRepository', () => {
  test('deve retornar null se o usuário não for encontrado', async () => {
    const sut = makeSut()

    const user = await sut.find('email_invalido@mail.com')

    expect(user).toBeNull()
  })
})
