const { Mongo } = require('../lib/infra')
const { env } = require('./config')

Mongo.connect(env.mongoUrl)
  .then(() => {
    const app = require('./app')
    app.listen(5858, () => console.log('Server Running'))
  })
  .catch(console.error)
