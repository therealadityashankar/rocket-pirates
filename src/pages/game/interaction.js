export default (canvas) => {
  const interaction = {
    mouse: {down: false, position: {x: NaN, y: NaN}},
    keysPressed: new Set()
  }


  canvas.addEventListener("mousedown", e => {
    interaction.mouse.down = true
    interaction.mouse.position = {x: e.offsetX, y: e.offsetY}
  })

  canvas.addEventListener("mouseup", () => interaction.mouse.down = false)
  canvas.addEventListener("mousemove", e => interaction.mouse.position = {x: e.offsetX, y: e.offsetY})

  document.addEventListener("keydown", e => interaction.keysPressed.add(e.keyCode))
  document.addEventListener("keyup", e => interaction.keysPressed.delete(e.keyCode))

  return interaction
}
