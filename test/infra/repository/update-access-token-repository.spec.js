const { Mongo } = require('../../../src/lib/infra')

let db

class UpdateAccessTokenRepository {
  constructor(userModel) {
    this.userModel = userModel
  }

  async update(_id, accessToken) {
    await this.userModel.updateOne({ _id }, { $set: { accessToken } })
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)

  return {
    sut,
    userModel,
  }
}

describe('UpdateAccessTokenRepository', () => {
  beforeAll(async () => {
    await Mongo.connect(process.env.MONGO_URL)
    db = await Mongo.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await Mongo.disconnect()
  })

  test('deve atualizar o usuário com um dado accessToken', async () => {
    const { sut, userModel } = makeSut()
    const newUser = {
      _id: 'qualquer_id',
      nome: 'qualquer_nome',
      email: 'email_existente@mail.com',
      senha: 'senha_hashed',
      idade: 50,
      estado: 'qualquer_estado',
    }
    await userModel.insertOne(newUser)
    await sut.update(newUser._id, 'valid_token')
    const updateUser = await userModel.findOne({ _id: newUser._id })
    expect(updateUser.accessToken).toBe('valid_token')
  })
})
