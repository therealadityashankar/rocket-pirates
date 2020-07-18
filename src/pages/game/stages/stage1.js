import Ship from "../ships/ship.js"

let policeShip, pirateShip;

export async function addFeatures(_pirateShip, ships, canvas, ctx){
  pirateShip = _pirateShip
  policeShip = await Ship.create({ctx, 
                                  x : canvas.width/2, 
                                  y : 100,
                                  health : 100,
                                  velocity: {x: 5, y: 5},
                                  shot: {
                                    velocity: {x: 0, y: 300}, 
                                    maxFiringRate: 0.1, // seconds gap per bullet
                                    damage: 10
                                  },
                                  fitSize: {width: 100, height: 100},
                                  imageStuff: ["../images/police_rocket.svg",
                                               import.meta.url]})

  pirateShip.addMutualEnemies(policeShip)
  ships.add(policeShip)
}

export function draw(){
  const seconds = performance.now()/1000
  const rem6 = seconds%6 
  if(rem6 < 3) {
    policeShip.fire()
  }

  if(rem6 < 5 && rem6 > 2) policeShip.goLeft()
  else policeShip.goRight()
}

export function hasWon(){
  return policeShip.dead
}

export function hasLost(){
  return pirateShip.dead
}
