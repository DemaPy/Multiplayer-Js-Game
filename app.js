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

const PLAYERS = {}

// On User connection create PLAYER in PLAYER object with properties.
io.on('connection', (socket) => {
  console.log(socket.id, ' CONNECTED')
  PLAYERS[socket.id] = {
    x: 200,
    y: 700,
    color: "yellow"
  }
  
  io.emit("players", {payload: PLAYERS})

  socket.on('disconnect', () => {
    console.log(socket.id, ' DISCONNECTED')
    delete PLAYERS[socket.id]
  })

  console.log(PLAYERS);
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
