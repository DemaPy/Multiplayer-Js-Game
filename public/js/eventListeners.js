// On click event compute player position
// based on player position compute angle for projectline
// create velocity object with x and y coordinates
// using cos function for X axis and sin function for Y axis
// in order to get direction of moving

// Emit event to backend to create projectline
addEventListener('click', (event) => {
  const playerPosition = {
    x: PLAYERS_OBJECT[socket.id].x,
    y: PLAYERS_OBJECT[socket.id].y
  }
  // Point from where everything starts from.
  // Like anchor point for every new Projectline.
  // We have synchronized position in constructor call also.
  // new Projectile({
  //   x: canvas.width / 2,
  //   y: canvas.height / 2,
  // })
  // - canvas.height / 2
  // - canvas.width / 2
  const angle = Math.atan2(
    event.clientY * window.devicePixelRatio - playerPosition.y,
    event.clientX * window.devicePixelRatio - playerPosition.x
  )

  // We can't set velocity on fronend because of cheatin reason
  // Someine can set values by yourself and have SUPERPOWER
  // const velocity = {
  //   x: Math.cos(angle) * 5,
  //   y: Math.sin(angle) * 5
  // }

  //
  socket.emit('shoot', {
    payload: {
      angle,
      x: playerPosition.x,
      y: playerPosition.y
    }
  })
  projectiles.push(
    new Projectile({
      x: playerPosition.x,
      y: playerPosition.y,
      radius: 5,
      color: 'white',
      velocity
    })
  )
})
