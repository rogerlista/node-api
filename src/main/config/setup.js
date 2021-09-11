const { cors, jsonParse } = require('../middleware')

module.exports = (app) => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParse)
}
