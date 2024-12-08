const express = require('express')
const app = express()
const port = 3000
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')

const io = new Server(server)

// Read public folder in the project in order to get acces for scripts
// inside index.html file we have js exports
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  console.log(socket.id, ' CONNECTED')

  socket.on('disconnect', () => {
    console.log(socket.id, ' DISCONNECTED')
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
