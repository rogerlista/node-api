const request = require('supertest')

const app = require('../../../src/main/app')

describe('JSONParser', () => {
  test('deve fazer o parse do body como JSON', async () => {
    app.post('/fazer_parse_json', (req, res) => {
      res.send(req.body)
    })
    const res = await request(app)
      .post('/fazer_parse_json')
      .send({ name: 'Juca' })
    expect(res.text).toBe('{"name":"Juca"}')
  })
})
