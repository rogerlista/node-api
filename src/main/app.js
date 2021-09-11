const express = require('express')

const { setup } = require('./config')

const app = express()
setup(app)
module.exports = app
