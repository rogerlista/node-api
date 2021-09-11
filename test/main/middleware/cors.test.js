const request = require('supertest')

const app = require('../../../src/main/app')

describe('CORS', () => {
  test('deve habilitar', async () => {
    app.get('/habilita_cors', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/habilita_cors')
    expect(res.headers['access-control-allow-origin']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('*')
    expect(res.headers['access-control-allow-headers']).toBe('*')
  })
})
