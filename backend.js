const express = require('express')
const app = express()
const port = 3000
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')

const io = new Server(server, {
  pingTimeout: 5000,
  pingInterval: 2000
})

// Read public folder in the project in order to get acces for scripts
// inside index.html file we have js exports
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const PLAYERS_FRONTEND = {}

// On User connection create PLAYER in PLAYER object with properties.
// x, y, color,
// x,y position should be received from frontend available place.
// Notify all players in game.
io.on('connection', (socket) => {
  console.log(socket.id, ' CONNECTED')
  PLAYERS_FRONTEND[socket.id] = {
    x: 600 * Math.random(),
    y: 600 * Math.random(),
    color: `hsl(${360 * Math.random()}, 100%, 50%)`
  }

  io.emit('sync_players', { payload: PLAYERS_FRONTEND })

  socket.on('disconnect', (reason) => {
    console.log(socket.id, reason, ' DISCONNECTED')
    if (reason === 'transport close') {
    }
    delete PLAYERS_FRONTEND[socket.id]
    io.emit('sync_players', { payload: PLAYERS_FRONTEND })
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
