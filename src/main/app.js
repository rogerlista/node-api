const express = require('express')

const { setup } = require('./config')
const { cors, jsonParse } = require('./middleware')
const app = express()
setup(app)
app.use(cors)
app.use(jsonParse)
module.exports = app
