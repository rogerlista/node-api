const request = require('supertest')

describe('ContentType', () => {
  let app

  beforeEach(() => {
    jest.resetModules()
    app = require('../../../src/main/app')
  })

  test('deve retornar um json content-type como default', async () => {
    app.get('/content_type', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/content_type')
    expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
    expect(res.headers['content-type']).toMatch(/json/)
  })

  test('deve retornar um xml content-type se forçado', async () => {
    app.get('/content_type', (req, res) => {
      res.type('xml')
      res.send('')
    })
    const res = await request(app).get('/content_type')
    expect(res.headers['content-type']).toBe('application/xml; charset=utf-8')
    expect(res.headers['content-type']).toMatch(/xml/)
  })
})
