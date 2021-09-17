const { LoginRouter } = require('../composer')
const { ExpressRouterAdapter } = require('../adapter')

module.exports = (router) => {
  router.post('/login', ExpressRouterAdapter.adapt(LoginRouter.compose()))
}
