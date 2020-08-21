const express = require('express')
const app = express()
const PORT = 3000

app.get('/user', (req, res) => {
  res.send({
    user: '海云'
  })
})
app.get('/login', (req, res) => {
  res.send({
    login: true
  })
})

app.use((req, res) => {
  res.send('404')
})

app.listen(PORT, () => {
  console.log('running 3000....');
})
