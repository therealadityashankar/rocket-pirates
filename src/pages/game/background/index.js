import {Star, stars} from "./stars.js"

let ctx;

/**initialize the stars*/
const init = (options) => {
  ctx = options.ctx
  const maxStarRadius = options.maxStarRadius
  for(let i=0; i<options.starCount; i++){
    stars.push(new Star({ctx, maxStarRadius}))
  }
}


const draw = () => {
  ctx.save()
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  stars.forEach(star => star.draw())
  ctx.restore()
}


export default {draw, init};
