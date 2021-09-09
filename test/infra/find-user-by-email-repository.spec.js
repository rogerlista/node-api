const { MongoClient } = require('mongodb')

const { FindUserByEmailRepository } = require('../../src/infra')

let db
let connection

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new FindUserByEmailRepository(userModel)
  return {
    sut,
    userModel,
  }
}

describe('FindUserByEmailRepository', () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    db = connection.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await connection.close()
  })

  test('deve retornar null se o usuário não for encontrado', async () => {
    const { sut } = makeSut()

    const user = await sut.find('email_invalido@mail.com')

    expect(user).toBeNull()
  })

  test('deve retornar o usuário', async () => {
    const { sut, userModel } = makeSut()
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
})
