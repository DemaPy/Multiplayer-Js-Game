const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const socket = io()

const scoreEl = document.querySelector('#scoreEl')

const DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1

canvas.width = innerWidth * DEVICE_PIXEL_RATIO
canvas.height = innerHeight * DEVICE_PIXEL_RATIO

const x = canvas.width / 2
const y = canvas.height / 2

// Create player in the center coordinates of the screen
// width / 2
// height / 2

// Players store
const PLAYERS_OBJECT = {}

// Listen to socket events
socket.on('sync_players', ({ payload }) => {
  for (const id of Object.keys(payload)) {
    if (!(id in PLAYERS_OBJECT)) {
      PLAYERS_OBJECT[id] = new Player({
        ...payload[id],
        radius: 10 * DEVICE_PIXEL_RATIO
      })
    } else {
      // Update position for existing project
      PLAYERS_OBJECT[id].x = payload[id].x
      PLAYERS_OBJECT[id].y = payload[id].y
    }
  }
  // SYNC FRONTEND PLAYERS WITH BACKEND PLAYERS
  for (const key in PLAYERS_OBJECT) {
    if (!(key in payload)) {
      delete PLAYERS_OBJECT[key]
    }
  }
  animate()
})
let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  for (const id of Object.keys(PLAYERS_OBJECT)) {
    const player = PLAYERS_OBJECT[id]
    player.draw()
  }
}

animate()

const KEYS = {
  w: {
    pressed: false
  },
  d: {
    pressed: false
  },
  s: {
    pressed: false
  },
  a: {
    pressed: false
  }
}

function getPlayer() {
  const playerId = socket.id
  const player = PLAYERS_OBJECT[playerId]
  return player
}

setInterval(() => {
  const player = getPlayer()
  if (!player) {
    return
  }
  if (KEYS.w.pressed) {
    player.y -= 5
    socket.emit('keydown', { payload: 'KeyW' })
  }

  if (KEYS.d.pressed) {
    player.x += 5
    socket.emit('keydown', { payload: 'KeyD' })
  }

  if (KEYS.s.pressed) {
    player.y += 5
    socket.emit('keydown', { payload: 'KeyS' })
  }

  if (KEYS.a.pressed) {
    player.x -= 5
    socket.emit('keydown', { payload: 'KeyA' })
  }
}, 15)

// HANDLE MOVING
window.addEventListener('keydown', (ev) => {
  const player = getPlayer()
  if (!player) {
    return
  }
  switch (ev.code) {
    case 'KeyW':
      KEYS.w.pressed = true
      break
    case 'KeyD':
      KEYS.d.pressed = true
      break
    case 'KeyS':
      KEYS.s.pressed = true
      break
    case 'KeyA':
      KEYS.a.pressed = true
      break
    default:
      break
  }
  PLAYERS_OBJECT[playerId] = player
  animate()
})

window.addEventListener('keyup', (ev) => {
  const player = getPlayer()
  if (!player) {
    return
  }
  switch (ev.code) {
    case 'KeyW':
      KEYS.w.pressed = false
      break
    case 'KeyD':
      KEYS.d.pressed = false
      break
    case 'KeyS':
      KEYS.s.pressed = false
      break
    case 'KeyA':
      KEYS.a.pressed = false
      break
    default:
      break
  }
  PLAYERS_OBJECT[playerId] = player
  animate()
})
