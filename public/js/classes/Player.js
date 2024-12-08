class Player {
  x
  y
  radius
  color
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    // Canvas context create circle at given coordinates and radius utilize arc function
    // With 360 angle:
    // Math.PI -> 3.14 RAD -> 1 RAD -> 57.2958 DEGREES
    // 3.14 RAD * 57.2968 -> 179.9087 (Math.PI) * 2 -> 360 DEGREES
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}
