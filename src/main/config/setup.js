const { cors, jsonParser, contentType } = require('../middleware')

module.exports = (app) => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParser)
  app.use(contentType)
}
