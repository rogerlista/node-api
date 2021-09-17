const { UpdateAccessTokenRepository } = require('../../../src/infra/repository')
const { ParametroObrigatorioError } = require('../../../src/lib/error')
const { Mongo } = require('../../../src/lib/infra')

const makeSut = () => {
  return new UpdateAccessTokenRepository()
}

describe('UpdateAccessTokenRepository', () => {
  let userModel
  const newUser = {
    _id: 'qualquer_id',
    nome: 'qualquer_nome',
    email: 'email_existente@mail.com',
    senha: 'senha_hashed',
    idade: 50,
    estado: 'qualquer_estado',
  }

  beforeAll(async () => {
    await Mongo.connect(process.env.MONGO_URL)
    userModel = await Mongo.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
    await userModel.insertOne(newUser)
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  test('deve atualizar o usuário com um dado accessToken', async () => {
    const sut = makeSut()
    await sut.update(newUser._id, 'valid_token')
    const updateUser = await userModel.findOne({ _id: newUser._id })
    expect(updateUser.accessToken).toBe('valid_token')
  })

  test('deve lançar uma exceção se o ID não for informado', async () => {
    const sut = makeSut()
    const promise = sut.update()
    await expect(promise).rejects.toThrow(new ParametroObrigatorioError('ID'))
  })

  test('deve lançar uma exceção se o accessToken não for informado', async () => {
    const sut = makeSut()
    const promise = sut.update(newUser._id)
    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('Access Token')
    )
  })
})
