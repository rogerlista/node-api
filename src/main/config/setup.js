const { cors, jsonParse, contentType } = require('../middleware')

module.exports = (app) => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParse)
  app.use(contentType)
}
