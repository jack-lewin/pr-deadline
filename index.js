const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

var app = express()
app.use(bodyParser.json())

app.post('/', checkDeadline)

function checkDeadline (req, res) {
  var id = new Date(req.body.hook.id)
  var createdTime = new Date(req.body.hook.created_at)
  var endOfSprint = createdTime.getDay() === 2
  var afterDeadline = createdTime.getHours() >= 12

  // if it's not after 12pm on a Tuesday, don't do anything
  if (!endOfSprint || !afterDeadline) {
    return res.end()
  }

  axios.post(`https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/issues/${id}/labels`, ['LATE'])

  return res.end()
}

app.listen(process.env.PORT || 8080)
