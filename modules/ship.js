class Ship {
    constructor(name, length, shape) {
      this.name = name;
      this.length = length;
      this.shape = shape;
      this.shipNumber = Math.floor(Math.random() * 1000) + 1; // Unique identifier for the ship
      this.timesHit = 0;
      this.isSunken = false;
    }

    isSunk(){
      if(this.timesHit === this.length){
        return this.isSunken = true;
      }
    }
  
    getShipLength() {
      return this.length;
    }

    getTimesHit(){
      return this.timesHit;
    }
  }
  
  export { Ship };