import Ship from "./ships/ship.js"
import ShipsHandler from "./ships/handler.js"
import background from "./background/index.js"
import getInteractionIndicators from "./interaction.js"

export async function load(){
  const level = wcrouter.currentPath[wcrouter.currentPath.length - 1]
  const stage = (await import(`./stages/stage${level}.js`))
  const canvas = document.getElementById("game-canvas")
  const ctx = canvas.getContext("2d");
  canvas.width = document.body.offsetWidth
  canvas.height = window.innerHeight - 5

  await background.init({
    ctx,
    starCount: 50,
    maxStarRadius: 5
  })

  const pirateShip = await Ship.create({ctx, 
                                        x : canvas.width/2, 
                                        y : canvas.height - 100,
                                        health : 1000,
                                        velocity: {x: 5, y: 5},
                                        shot: {
                                          velocity: {x: 0, y: -300}, 
                                          maxFiringRate: 0.1, // seconds gap per bullet
                                          damage: 10,
                                        },
                                        fitSize: {width: 100, height: 100},
                                        imageStuff: ["./images/rocket.svg", import.meta.url]})

  const interaction = getInteractionIndicators(canvas)

  const ships = await ShipsHandler.create()
  ships.add(pirateShip)

  await stage.addFeatures(pirateShip, ships, canvas, ctx)
  draw(background, ships, interaction, pirateShip, canvas, stage)
}

function draw(background, ships, interaction, pirateShip, canvas, stage){
  const recurser = () => {
    background.draw()
    stage.draw()
    ships.draw()

    if(interaction.keysPressed.has(37)) pirateShip.goLeft()
    if(interaction.keysPressed.has(39)) pirateShip.goRight()
    if(interaction.keysPressed.has(38)) pirateShip.fire()

    if(interaction.mouse.down){
      const halfPoint = canvas.width/2
      if(interaction.mouse.position.x < halfPoint) pirateShip.goLeft()
      else pirateShip.goRight()
    }

    if(stage.hasWon()) wcrouter.mainrouter.setRoute("/start/you-win")
    else if(stage.hasLost()) wcrouter.mainrouter.setRoute("/start/you-lost")
    else requestAnimationFrame(recurser)
  }

  requestAnimationFrame(recurser)
}
