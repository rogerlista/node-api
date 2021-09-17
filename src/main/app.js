const express = require('express')

const { setup, routes } = require('./config')

const app = express()
setup(app)
routes(app)
module.exports = app
