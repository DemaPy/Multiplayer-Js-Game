const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const socket = io()

const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth
canvas.height = innerHeight

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
      PLAYERS_OBJECT[id] = new Player({ ...payload[id], radius: 10, color: `hsl(${360 * Math.random()}, 100%, 50%)` })
    }
  }
  // SYNC FRONTEND PLAYERS WITH BACKEND PLAYERS
  for (const key in PLAYERS_OBJECT) {
    if (!(key in payload)) {
      delete PLAYERS_OBJECT[key]
    }
  }
  console.log(PLAYERS_OBJECT);

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
