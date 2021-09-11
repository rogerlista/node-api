const express = require('express')

const { setup } = require('./config')
const { cors } = require('./middleware')

const app = express()
setup(app)
app.use(cors)
module.exports = app
