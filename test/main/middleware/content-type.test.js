const request = require('supertest')

const app = require('../../../src/main/app')

describe('ContentType', () => {
  test('deve retornar um json content-type como default', async () => {
    app.get('/content_type_json', (req, res) => {
      res.send({})
    })
    const res = await request(app).get('/content_type_json')
    expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
    expect(res.headers['content-type']).toMatch(/json/)
  })

  test('deve retornar um xml content-type se forçado', async () => {
    app.get('/content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    const res = await request(app).get('/content_type_xml')
    expect(res.headers['content-type']).toBe('application/xml; charset=utf-8')
    expect(res.headers['content-type']).toMatch(/xml/)
  })
})
