const http = require('http')

const PORT = 3000
console.log(process.env.NODE_ENV) // 环境变量
const serverHandle = require('../app')
const server = http.createServer(serverHandle)

server.listen(PORT)

