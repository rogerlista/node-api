const { Mongo } = require('../lib/infra')
const { env } = require('./config')

Mongo.connect(env.mongoUrl)
  .then(() => {
    const app = require('./app')
    app.listen(env.port, () =>
      console.log(`Server running at http://localhost:${env.port}`)
    )
  })
  .catch(console.error)
