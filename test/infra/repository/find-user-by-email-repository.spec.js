const { FindUserByEmailRepository } = require('../../../src/infra/repository')
const { ParametroObrigatorioError } = require('../../../src/lib/error')
const { Mongo } = require('../../../src/lib/infra')

const makeSut = () => {
  return new FindUserByEmailRepository()
}

describe('FindUserByEmailRepository', () => {
  let userModel

  beforeAll(async () => {
    await Mongo.connect(process.env.MONGO_URL)
    userModel = await Mongo.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  test('deve retornar null se o usuário não for encontrado', async () => {
    const sut = makeSut()

    const user = await sut.find('email_invalido@mail.com')

    expect(user).toBeNull()
  })

  test('deve retornar o usuário', async () => {
    const sut = makeSut()
    const fakeUser = {
      _id: 'qualquer_id',
      nome: 'qualquer_nome',
      email: 'email_existente@mail.com',
      senha: 'senha_hashed',
      idade: 50,
      estado: 'qualquer_estado',
    }
    await userModel.insertOne(fakeUser)
    const user = await sut.find('email_existente@mail.com')
    expect(user).toEqual({
      _id: 'qualquer_id',
      senha: 'senha_hashed',
    })
  })

  test('deve lançar uma exceção se o email não for informado', async () => {
    const sut = makeSut()
    const promise = sut.find()
    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('E-mail')
    )
  })
})
