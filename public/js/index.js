const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const socket = io()

const projectiles = []
const playerInputs = []
const CONFIG = {
  velocity: 5
}

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
    const BACKEND_PLAYER = payload[id]
    if (!(id in PLAYERS_OBJECT)) {
      PLAYERS_OBJECT[id] = new Player({
        ...BACKEND_PLAYER,
        radius: 10 * DEVICE_PIXEL_RATIO
      })
    } else {
      if (socket.id === id) {
        // Update position for existing player
        PLAYERS_OBJECT[id].x = BACKEND_PLAYER.x
        PLAYERS_OBJECT[id].y = BACKEND_PLAYER.y
        const lastAppliedKeyDown = playerInputs.findIndex((item) => {
          return item.sequenceNumber === BACKEND_PLAYER.sequenceNumber
        })

        if (lastAppliedKeyDown !== -1) {
          // Splice inputs and apply movements for player
          playerInputs.splice(0, lastAppliedKeyDown + 1)
          playerInputs.forEach((item) => {
            PLAYERS_OBJECT[id].x = item.x
            PLAYERS_OBJECT[id].y = item.y
          })
        }
      } else {
        // Update position for other players
        // But if player will have latency our movement for him will looks like teleportation.
        // In order to fix it, we can use GSAP to move subject smoothly by filling GAP in moving values.

        // PLAYERS_OBJECT[id].x = BACKEND_PLAYER.x
        // PLAYERS_OBJECT[id].y = BACKEND_PLAYER.y

        gsap.to(PLAYERS_OBJECT[id], {
          x: BACKEND_PLAYER.x,
          y: BACKEND_PLAYER.y,
          duration: 0.015,
          ease: 'linear'
        })
      }
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

  for (let index = projectiles.length - 1; index >= 0; index--) {
    const line = projectiles[index];
    line.update()
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

// If some user will spam keyboard event to server
// we will have latency, because server can't handle each keyboard event
// every 15ms.

// We will store player keyDown in playerInputs array with value to apply.
// Also, need to store sequenceNumber in order to clice events that has been handled by server succesfully
// sequenceNumber should be send to server and attached for every user in order to know at what sequence server applied keyDown event

// When sync_players event fired from server,
// we will slice playerInputs at sequenceNumber and apply events that has been applied from server.
// Splice playerInputs up to events at sequenceNumber.
let sequenceNumber = 0
setInterval(() => {
  const player = getPlayer()
  if (!player) {
    return
  }
  if (KEYS.w.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, x: 0, y: -CONFIG.velocity })
    player.y -= CONFIG.velocity
    socket.emit('keydown', {
      payload: {
        keyCode: 'KeyW',
        sequenceNumber
      }
    })
  }

  if (KEYS.d.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, x: 0, x: CONFIG.velocity })
    player.x += CONFIG.velocity
    socket.emit('keydown', {
      payload: {
        keyCode: 'KeyD',
        sequenceNumber
      }
    })
  }

  if (KEYS.s.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, x: 0, y: CONFIG.velocity })
    player.y += CONFIG.velocity
    socket.emit('keydown', {
      payload: {
        keyCode: 'KeyS',
        sequenceNumber
      }
    })
  }

  if (KEYS.a.pressed) {
    sequenceNumber++
    playerInputs.push({ sequenceNumber, x: 0, x: -CONFIG.velocity })
    player.x -= CONFIG.velocity
    socket.emit('keydown', {
      payload: {
        keyCode: 'KeyA',
        sequenceNumber
      }
    })
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
  animate()
})

window.addEventListener('blur', (ev) => {
  KEYS.w.pressed = false
  KEYS.d.pressed = false
  KEYS.s.pressed = false
  KEYS.a.pressed = false
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
  animate()
})
