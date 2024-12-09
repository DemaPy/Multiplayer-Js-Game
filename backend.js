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

const PLAYERS_BACKEND = {}
const PROJECTILES = {}
const CONFIG = {
  velocity: 5,
  radius: 5
}

// Read public folder in the project in order to get acces for scripts
// inside index.html file we have js exports
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

function createPlayer() {
  return {
    x: 600 * Math.random(),
    y: 600 * Math.random(),
    color: `hsl(${360 * Math.random()}, 100%, 50%)`,
    sequenceNumber: 0
  }
}

// On User connection create PLAYER in PLAYER object with properties.
// x, y, color,
// x,y position should be received from frontend available place.
// Notify all players in game.
let projectLineId = 0
io.on('connection', (socket) => {
  console.log(socket.id, ' CONNECTED')
  PLAYERS_BACKEND[socket.id] = createPlayer()

  socket.on('keydown', ({ payload }) => {
    const { keyCode, sequenceNumber } = payload
    const playerId = socket.id
    const player = PLAYERS_BACKEND[playerId]
    if (!player) {
      return
    }
    player.sequenceNumber = sequenceNumber
    switch (keyCode) {
      case 'KeyW':
        player.y -= CONFIG.velocity
        break
      case 'KeyD':
        player.x += CONFIG.velocity
        break
      case 'KeyS':
        player.y += CONFIG.velocity
        break
      case 'KeyA':
        player.x -= CONFIG.velocity
        break
      default:
        break
    }
    PLAYERS_BACKEND[playerId] = player
  })

  // On each tick iterate over each PROJECTILE and increment x and y position to move them
  setInterval(() => {
    for (const key in PROJECTILES) {
      const projectile = PROJECTILES[key]
      projectile.x = projectile.x + projectile.velocity.x
      projectile.y = projectile.y + projectile.velocity.y
    }
    io.emit('sync_players', { payload: PLAYERS_BACKEND })
    io.emit('sync_projectiles', { payload: PROJECTILES })
  }, 15)

  socket.on('shoot', ({ payload }) => {
    const playerId = socket.id
    const player = PLAYERS_BACKEND[playerId]
    if (!player) {
      return
    }
    projectLineId++
    const { angle, x, y } = payload
    const velocity = {
      x: Math.cos(angle) * CONFIG.velocity,
      y: Math.sin(angle) * CONFIG.velocity
    }
    PROJECTILES[projectLineId] = {
      velocity,
      x,
      y,
      player_id: socket.id,
      color: player.color,
      radius: CONFIG.radius
    }
  })

  socket.on('disconnect', (reason) => {
    console.log(socket.id, reason, ' DISCONNECTED')
    if (reason === 'transport close') {
    }
    delete PLAYERS_BACKEND[socket.id]
  })
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
