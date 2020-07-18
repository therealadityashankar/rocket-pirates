import ImageOlive from "../imageolive/imageOlive.js"
import colors from "../imageolive/colors.js"
import Shot from "./shot.js"

/**
 * the ship
 */
class Ship{
  /**
   * true constructor as an async constructor is required !,
   * do NOT create this with `new Ship(...)` and instead use `await Ship.create(...)`
   * NOTE: fitSize is NOT the true size of the ship, it defines the box to
   * fit the ship in, please re-check the ship size with Ship.width and Ship.height
   *
   * @param {CanvasRenderingContext2d} ctx - the canvas to draw in
   * @param {number} x - the starting x position
   * @param {number} y - the starting y position
   * @param {number} velocity.x - the x velocity while moving
   * @param {number} velocity.y - the y velocity while moving
   * @param {number} fitSize.width - the width of the ship to fit in
   * @param {number} fitSize.height - the height of the ship to fit in
   * @param {array} imageStuff - [url: String, baseUrl: String], url of the ships image and baseUrl is generally import.meta.url or document.currentScript.src
   *
   * @param {number} shot.velocity.x - the shooting velocity's x velocity
   * @param {number} shot.velocity.y - the shooting velocity's y velocity
   * @param {number} shot.maxFiringRate - the max firing rate of guns, per second
   * @param {number} shot.damage - the damage a shot does !
   *
   * @param {number} health - the max health of a ship
   */
  static async create({ctx, x, y, velocity, shot, fitSize, imageStuff, health}){
    const ship = new Ship()
    ship.ctx = ctx

    const rocketImage = await ImageOlive.create(...imageStuff)
    rocketImage.fit(fitSize.width, fitSize.height, true)
    rocketImage.drawMode = "center"

    ship.rocketImage = rocketImage
    ship.width = ship.rocketImage.width
    ship.height = ship.rocketImage.height
    ship.x = x
    ship.y = y
    ship.velocity = velocity
    ship.shots = new Set()
    ship.shot = shot
    ship.shot.lastFired = 0

    ship.maxHealth = health
    ship.health = health

    ship.enemies = new Set()

    return ship
  }

  get dead(){
    return this.health <= 0
  }

  /**set the ship's position*/
  setPosition(x, y){
    this.x = x
    this.y = y
  }

  /** move left, Note : the ship will never go beyond the canvas width **/
  goLeft(){
    const newX = this.x - this.velocity.x
    if(newX >= 0) this.x = newX
  }

  /** move right, Note : the ship will never go beyond the canvas**/
  goRight(){
    const newX = this.x + this.velocity.x
    if(newX <= this.ctx.canvas.width) this.x = newX
  }

  /** move above, Note : the ship will never go beyond the canvas*/
  goAbove(){
    const newY = this.y - this.velocity.y
    if(this.y >= 0) this.y = newY
  }

  /** go below, Note : the ship will never go beyond the canvas*/
  goBelow(){
    const newY = this.y - this.velocity.y
    if(this.y <= this.ctx.canvas.height) this.y = newY
  }

  /**
   * represent the ship in a canvas context
   *
   * @param ctx - a canvas context
   */
  draw(){
    this._drawBacklight()
    this._drawShots()
    this.checkIfShot(this.enemies)
    this.rocketImage.draw(this.ctx, this.x, this.y);
  }

  _drawBacklight(){
    const [ctx, x, y] = [this.ctx, this.x, this.y]
    const backlightRadius = 150

    ctx.beginPath()
    ctx.arc(x, y, backlightRadius, 0, 2*Math.PI);

    const grd = ctx.createRadialGradient(x, y, 20, x, y, backlightRadius);
    grd.addColorStop(0, colors.gray(this.health/this.maxHealth))
    grd.addColorStop(1, "transparent")
    ctx.fillStyle = grd

    ctx.fill()
  }

  _drawShots(){
    for(const shot of this.shots){
      shot.draw()
      if(shot.isOutOfScreen || shot.usedUp) this.shots.delete(shot)
    }
  }

  /**fire a shot, if this fn is called before the shot.maxFiringRate time, no shot will be shot*/
  fire(){
    const shootingSecondsPassed = (performance.now() - this.shot.lastFired)/1000

    if(shootingSecondsPassed > this.shot.maxFiringRate){
      this.shots.add(new Shot({x: this.x, 
                               y: this.y - this.height/2, 
                               velocity: this.shot.velocity,
                               damage: this.shot.damage,
                               ctx: this.ctx,
                               color: "white",}))
      this.shot.lastFired = performance.now()
    }
  }

  /**
   * check if a ship has been shot, does not return
   * anything, sets stuff automatically
   *
   * @param {iterable} - an iterable of people the ship considers enemies
   */
  checkIfShot(enemies){
    for(const enemy of enemies){
      const shotCheck = enemy.hasShot(this)
      if(shotCheck.hasBeenShot){
        if(this.health > 0) this.health -= shotCheck.shot.damage
        if(this.health < 0) this.health = 0
      }
    }
  }

  /**
   * check if we've shot anyone
   *
   * @param hittalbe - a ship like object that can be hit
   */
  hasShot(hittable){
    for(const shot of this.shots){
      if(shot.hasHit(hittable)) return {hasBeenShot: true, shot: shot}
    }
    return {hasBeenShot: false}
  }

  /**
   * sets both ships as enemies of each other
   *
   * @param ...enemies - all enemies
   **/
  addMutualEnemies(...enemies){
    for (const enemy of enemies) {
      this.enemies.add(enemy)
      enemy.enemies.add(this)
    }
  }
}

export default Ship;
