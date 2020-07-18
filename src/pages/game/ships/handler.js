/**
 * ships handler
 *
 * handles ships
 */
class ShipsHandler{
  /**Use ShipsHandler.create(...) instead of this*/
  constructor(){
    this.ships = new Set()
  }

  /**
   * create a ships handler, should be used instead of the constructor
   */
  static async create(){
    return new ShipsHandler()
  }

  /** works similarly to Set.add */
  add(ship){
    return this.ships.add(ship)
  }

  /** works similarly to Set.delete */
  delete(ship){
    return this.ships.delete(ship)
  }

  /** works similarly to Set.has */
  has(ship){
    return this.ships.has(ship)
  }

  /**
   * the main draw function
   */
  draw(){
    for (const ship of this.ships) {
      ship.draw()
      
      if(ship.dead){
        this.delete(ship)
      }
    }
  }
}

export default ShipsHandler;
