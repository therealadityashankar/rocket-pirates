/**
 * the firing shot from a ship
 */
class Shot{
  /**
   * @param {number} x - the x position of the initial position of the bullet
   * @param {number} y - the y position of the initial position of the bullet
   * @param {object} velocity - the velocity of the bullet
   * @param {number} velocity.x - the x velocity of the bullet
   * @param {number} velocity.y - the x velocity of the bullet
   * @param {CanvasRenderingContext2D} ctx - the ctx of the canvas to draw in
   * @param {number} range - the width of possible damage
   * @param {array} color - the color of the bullet (as a canvas color)
   *
   * @param {number} damage - the damage a shot does
   */
  constructor({x, y, velocity, ctx, color, damage}){
    this.x = x
    this.y = y
    this.velocity = velocity
    this.ctx = ctx
    this.color = color
    this.lastDrawTime = NaN
    this.damage = damage

    /**a shot may only be used once, if this is true, the shot has been used up !*/
    this.usedUp = false
  }

  /** draw the bullet **/
  draw(){
    if(Number.isNaN(this.lastDrawTime)) this.lastDrawTime = performance.now()
    this._move()

    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, 3, 0, 2*Math.PI)
    this.ctx.fillStyle = this.color
    this.ctx.fill()
    this.ctx.restore()
  }

  _move(){
    const secondsPassed = (performance.now() - this.lastDrawTime)/1000
    this.x += secondsPassed*this.velocity.x
    this.y += secondsPassed*this.velocity.y
    this.lastDrawTime = performance.now()
  }

  /**check is within a certian rectangular area**/
  isInArea(xMin, xMax, yMin, yMax){
    const xInRange = xMax > this.x && xMin < this.x
    const yInRange = yMax > this.y && yMin < this.y
    return xInRange && yInRange
  }

  /**
   * check if the ship has hit a certian
   * "hittable" object
   *
   * Note: an bullet may only hit an object once !, after
   * that the shot.usedUp becomes true
   *
   * @param hittable - an object like a ship, that can take in damage
   */
  hasHit(hittable){
    if(this.usedUp) return false

    const minX = hittable.x - hittable.width/2
    const maxX = hittable.x + hittable.width/2
    const minY = hittable.y - hittable.height/2
    const maxY = hittable.y + hittable.height/2
    const hit = this.isInArea(minX, maxX, minY, maxY)
    if(hit) this.usedUp = true
    return hit
  }

  /**
   * returns true if the bullet is out of the screen 
   */
  get isOutOfScreen(){
    const xInScreen = this.x > 0 && this.x < this.ctx.canvas.width
    const yInScreen = this.y > 0 && this.y < this.ctx.canvas.height
    return !(xInScreen && yInScreen)
  }
}

export default Shot;
