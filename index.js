const express = require('express')
const bodyParser = require('body-parser')

const { checkDeadline } = require('./app')

var app = express()
app.use(bodyParser.json())

app.post('/', checkDeadline)

app.listen(process.env.PORT || 8080, port => {
  console.log(`App listening on port ${port}`)
})
