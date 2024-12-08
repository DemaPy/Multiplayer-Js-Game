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
      PLAYERS_OBJECT[id] = new Player({
        ...payload[id],
        radius: 10 * DEVICE_PIXEL_RATIO
      })
    }
  }
  // SYNC FRONTEND PLAYERS WITH BACKEND PLAYERS
  for (const key in PLAYERS_OBJECT) {
    if (!(key in payload)) {
      delete PLAYERS_OBJECT[key]
    }
  }
  console.log(PLAYERS_OBJECT)

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

// HANDLE MOVING
window.addEventListener('keydown', (ev) => {
  const playerId = socket.id
  const player = PLAYERS_OBJECT[playerId]
  if (!player) {
    return
  }
  switch (ev.code) {
    case 'KeyW':
      socket.emit('keydown', { payload: 'KeyW' })
      break
    case 'KeyD':
      socket.emit('keydown', { payload: 'KeyD' })
      break
    case 'KeyS':
      socket.emit('keydown', { payload: 'KeyS' })
      break
    case 'KeyA':
      socket.emit('keydown', { payload: 'KeyA' })
      break
    default:
      break
  }
  animate()
})
