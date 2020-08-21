const http = require('http')

const PORT = 3000
const server = http.createServer((req, res) => {
  // req 是 response对象
  // res 是 request对象
  if (req)
    res.setHeader("Content-type", "application/json");
  res.end(JSON.stringify({
    userName: 'test'
  }))
})

server.listen(PORT)
console.log('running 3000....');

