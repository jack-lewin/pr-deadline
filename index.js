const express = require('express')
const bodyParser = require('body-parser')

const { checkDeadline, auth, authCallback } = require('./app')
const port = process.env.PORT || 8080

var app = express()
app.use(bodyParser.json())

app.get('/', auth)
app.get('/auth', authCallback)
app.post('/', checkDeadline)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
