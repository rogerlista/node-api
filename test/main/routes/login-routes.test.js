const request = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../../../src/main/app')
const { Mongo } = require('../../../src/lib/infra')

describe('Login Routes', () => {
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

  test('deve retornar 200 quando credenciais forem válidas', async () => {
    const fakeUser = {
      email: 'email_valido@mail.com',
      senha: bcrypt.hashSync('senha_hashed', 10),
    }
    await userModel.insertOne(fakeUser)
    const response = await request(app).post('/api/login').send({
      email: 'email_valido@mail.com',
      senha: 'senha_hashed',
    })
    expect(response.statusCode).toBe(200)
  })

  test('deve retornar 401 quando credenciais forem inválidas', async () => {
    const response = await request(app).post('/api/login').send({
      email: 'email_invalido@mail.com',
      senha: 'senha_invalida',
    })
    expect(response.statusCode).toBe(401)
  })
})
