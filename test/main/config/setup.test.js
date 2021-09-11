const request = require('supertest')

const app = require('../../../src/main/app')

describe('Setup', () => {
  test('deve desabilitar x-powered-by do header', async () => {
    app.get('/desabilita_x_powered_by', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/desabilita_x_powered_by')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })
})
