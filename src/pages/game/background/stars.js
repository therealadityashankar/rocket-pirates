import colors from "../imageolive/colors.js"
import random from "../imageolive/random.js"

const starTypes = ["normal", "shooting", "shining"]
const stars = []

const randomStarType = () => {
  if(Math.random() < 0.05) return "shooting"
  else if(Math.random() < 0.2) return "shining"
  else return "normal"
}


class Star{
  constructor({ctx, maxStarRadius, velocity, starType}){
    this.ctx = ctx
    const [width, height] = [ctx.canvas.width, ctx.canvas.height]
    this.type = starType||randomStarType()
    this.x = width*Math.random()
    this.y = height*random.randrange(-1, 1)
    this.initTime = performance.now()

    this.shineRate = random.randrange(0, 0.3)
    this.maxStarRadius = maxStarRadius
    this.shinepath = -1

    this.velocity = velocity
    
    if(!this.velocity){
      if(["normal", "shining"].includes(this.type)) this.velocity = {x:0, y: random.randrange(50, 200)}
      else if(this.type === "shooting") this.velocity = {x: random.randrange(100, 500), y: 500}
      else throw `unknown star type "${this.type}"`
    }

    this.radius = maxStarRadius*Math.random()
    this.color = colors.random([0, 360], [0, 100], [75, 100])
  }

  draw(){
    const grd = this.ctx.createRadialGradient(this.x, this.y, this.radius*0.2,
                                              this.x, this.y, this.radius);
    grd.addColorStop(0, this.color)
    grd.addColorStop(1, "transparent")

    this.ctx.beginPath()
    this.ctx.fillStyle = grd;
    this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI)
    this.ctx.fill()
    this.move()
  }

  move(){
    const ctx = this.ctx
    const [width, height] = [ctx.canvas.width, ctx.canvas.height]
    const secondsPassed = (performance.now() - this.initTime)/1000
    this.y += this.velocity.y*secondsPassed
    this.x += this.velocity.x*secondsPassed

    if(this.y > height || this.x > this.width){
      this.y = height*random.randrange(-1, 1)
      this.x = width*Math.random()
    }

    if(this.type === "shining"){
      if(this.radius <= 0) this.shinepath = 1
      if(this.radius >= this.maxStarRadius) this.shinepath = -1
      this.radius += this.shineRate*this.shinepath
      if(this.radius <= 0) this.radius = 0
    }

    this.initTime = performance.now()
  }
}


export {Star, stars};
