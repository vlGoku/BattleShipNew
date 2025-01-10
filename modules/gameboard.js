import { Ship } from "./ship.js";

class Gameboard {
  constructor() {
    this.gameboard = [];
    this.ships = [];
  }

  createGameboard() {
    for (let i = 0; i < 10; i++) {
      let row = new Array(10).fill(0);
      this.gameboard.push(row);
    }
  }

  createShipsCPU() {
    const carrier = new Ship("carrier", 5, "line");
    const battleship = new Ship("battleship", 4, "square");
    const cruiser = new Ship("cruiser", 3, "L");
    const submarine = new Ship("submarine", 4, "T");
    const destroyer = new Ship("destroyer", 1, "dot");
    this.ships.push(carrier, battleship, cruiser, submarine, destroyer);
  }

  placeShipsCPU() {
    for (const ship of this.ships) {
      let x, y;
      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      } while (!this.isPlacementValid(x, y, ship));

      this.placeShipShape(ship, x, y);
    }
  }

  placeShipShape(ship, x, y) {
    const shape = ship.shape;

    switch (shape) {
      case "line":
        for (let i = 0; i < ship.length; i++) {
          if (x + i < 10) this.gameboard[x + i][y] = ship.shipNumber;
        }
        break;

      case "square":
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            if (x + i < 10 && y + j < 10) this.gameboard[x + i][y + j] = ship.shipNumber;
          }
        }
        break;

      case "L":
        for (let i = 0; i < ship.length; i++) {
          if (i < ship.length - 1) {
            if (x + i < 10) this.gameboard[x + i][y] = ship.shipNumber;
          } else {
            if (x + i - 1 < 10 && y + 1 < 10) this.gameboard[x + i - 1][y + 1] = ship.shipNumber;
          }
        }
        break;

      case "T":
        for (let i = 0; i < 3; i++) {
          if (x < 10 && y - 1 + i < 10) this.gameboard[x][y - 1 + i] = ship.shipNumber;
        }
        if (x + 1 < 10) this.gameboard[x + 1][y] = ship.shipNumber;
        break;

      case "dot":
        if (x < 10 && y < 10) this.gameboard[x][y] = ship.shipNumber;
        break;
    }
  }

  isPlacementValid(x, y, ship) {
    const shape = ship.shape;

    switch (shape) {
      case "line":
        for (let i = 0; i < ship.length; i++) {
          if (x + i >= 10 || this.gameboard[x + i][y] !== 0) return false;
        }
        break;

      case "square":
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            if (x + i >= 10 || y + j >= 10 || this.gameboard[x + i][y + j] !== 0) return false;
          }
        }
        break;

      case "L":
        for (let i = 0; i < ship.length; i++) {
          if (i < ship.length - 1) {
            if (x + i >= 10 || this.gameboard[x + i][y] !== 0) return false;
          } else {
            if (x + i - 1 >= 10 || y + 1 >= 10 || this.gameboard[x + i - 1][y + 1] !== 0) return false;
          }
        }
        break;

      case "T":
        for (let i = 0; i < 3; i++) {
          if (x >= 10 || y - 1 + i >= 10 || this.gameboard[x][y - 1 + i] !== 0) return false;
        }
        if (x + 1 >= 10 || this.gameboard[x + 1][y] !== 0) return false;
        break;

      case "dot":
        if (x >= 10 || y >= 10 || this.gameboard[x][y] !== 0) return false;
        break;
    }

    return true;
  }

  attackShip(x, y) {
    const current = this.gameboard[x][y];
    const ship = this.ships.find((s) => s.shipNumber === current);
    if (ship) {
      ship.timesHit++;
      this.gameboard[x][y] = "X";
      return "Hit";
    }
    this.gameboard[x][y] = "O";
    return "Miss";
  }

/*   reset(){
    this.gameboard = Array(10).fill(null).map(() => Array(10).fill(0)); 
    this.ships = []; 
  } */
}

export { Gameboard };