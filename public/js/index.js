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
const player = new Player(x, y, 10, 'white')

// Store player array
const PLAYERS = [player]

// Listen to socket events
socket.on('players', ({ payload }) => {
  for (const key of Object.keys(payload)) {
    const { x, y, color } = payload[key]
    const player = new Player(x, y, 10, color)
    PLAYERS.push(player)
  }
  animate()
})

let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  PLAYERS.forEach((item) => item.draw())
}

animate()
