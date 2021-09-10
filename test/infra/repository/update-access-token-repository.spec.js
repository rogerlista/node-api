const { UpdateAccessTokenRepository } = require('../../../src/infra/repository')
const { ParametroObrigatorioError } = require('../../../src/lib/error')
const { Mongo } = require('../../../src/lib/infra')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)

  return {
    sut,
    userModel,
  }
}

describe('UpdateAccessTokenRepository', () => {
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
    db = await Mongo.getDb()
  })

  beforeEach(async () => {
    const userModel = await db.collection('users')
    await userModel.deleteMany()
    await userModel.insertOne(newUser)
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  test('deve atualizar o usuário com um dado accessToken', async () => {
    const { sut, userModel } = makeSut()
    await sut.update(newUser._id, 'valid_token')
    const updateUser = await userModel.findOne({ _id: newUser._id })
    expect(updateUser.accessToken).toBe('valid_token')
  })

  test('deve lançar uma exceção se userModel não for informado', async () => {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update()
    await expect(promise).rejects.toThrow()
  })

  test('deve lançar uma exceção se o ID não for informado', async () => {
    const { sut } = makeSut()
    const promise = sut.update()
    await expect(promise).rejects.toThrow(new ParametroObrigatorioError('ID'))
  })

  test('deve lançar uma exceção se o accessToken não for informado', async () => {
    const { sut } = makeSut()
    const promise = sut.update(newUser._id)
    await expect(promise).rejects.toThrow(
      new ParametroObrigatorioError('Access Token')
    )
  })
})
