class Captain {
    constructor(name, ability) {
      this.name = name;
      this.ability = ability;
      this.specialMoveCounter = 5; // Spezialzug ist alle 5 Runden verfügbar
    }
  
    resetCounter() {
      this.specialMoveCounter = 5; // Setzt den Zähler zurück
    }
  
    reduceCounter() {
      if (this.specialMoveCounter > 0) {
        this.specialMoveCounter--;
      }
    }
  
    canUseAbility() {
      return this.specialMoveCounter === 0;
    }
  
    // Diese Methode wird in den spezifischen Kapitänen überschrieben
    useSpecialAbility(gameboard, x, y) {
      throw new Error("This method should be implemented in subclasses");
    }
  }
  
  // William: Zerstört eine ganze Zeile oder Spalte bis ein Ziel getroffen wurde
  class CaptainWilliam extends Captain {
    constructor() {
      super("William", "Destroy a row or column");
    }
  
    useSpecialAbility(gameboard, choice, index) {
      if (!this.canUseAbility()) return "Ability not ready!";
      console.log(`Hello, I am ${this.name}`);
      const cpuGameboard = document.getElementById("cpuBoard");
  
      if (choice === "row") {
        for (let col = 0; col < 10; col++) {
          if (gameboard.gameboard[index][col] !== "X") {
            const attackResult = gameboard.attackShip(index, col);
            const targetCell = cpuGameboard.querySelector(`.cell[data-row="${index}"][data-col="${col}"]`);
            console.log(attackResult);
            if (attackResult === "Hit") {
              targetCell.classList.add("ship-hit");
            } else if (attackResult === "Miss") {
              targetCell.classList.add("missed-shot");
            }
          }
        }
      } else if (choice === "column") {
        for (let row = 0; row < 10; row++) {
          if (gameboard.gameboard[row][index] !== "X") {
            const attackResult = gameboard.attackShip(row, index);
            const targetCell = cpuGameboard.querySelector(`.cell[data-row="${row}"][data-col="${index}"]`);
            console.log(attackResult);
            if (attackResult === "Hit") {
              targetCell.classList.add("ship-hit");
            } else if (attackResult === "Miss") {
              targetCell.classList.add("missed-shot");
            }
          }
        }
      } else {
        return "Invalid choice! Please choose either 'row' or 'column'.";
      }
      console.log(gameboard);
      this.resetCounter();
      return `Captain William destroyed ${choice} ${index}!`;
    }
  }
  
  // Giuseppe: Zerstört 9 zufällige Felder
  class CaptainGiuseppe extends Captain {
    constructor() {
      super("Giuseppe", "Destroy 9 random fields");
    }
  
    useSpecialAbility(gameboard) {
      if (!this.canUseAbility()) return "Ability not ready!";
      console.log(`Hello i am in ${this.name}`)
      let destroyed = 0;
      while (destroyed < 9) {  
        const col = Math.floor(Math.random() * 10);
        const row = Math.floor(Math.random() * 10);
        const attackResult = gameboard.attackShip(row, col);
        const cpuGameboard = document.getElementById("cpuBoard");
        const targetCell = cpuGameboard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`)
        if (attackResult === "Hit") {
          targetCell.classList.add("ship-hit");
        } else if (attackResult === "Miss") {
          targetCell.classList.add("missed-shot");
        }
        destroyed++;
      } 
      console.log(gameboard);
      this.resetCounter();
      return "Captain Giuseppe destroyed 9 random fields!";
    }
  }
  
  // Astrid: Zerstört ein 3x3 Gebiet
  class CaptainAstrid extends Captain {
    constructor() {
      super("Astrid", "Destroy a 3x3 area");
    }
  
    useSpecialAbility(gameboard, x, y) {
      if (!this.canUseAbility()) return "Ability not ready!";
      console.log(`Hello i am in ${this.name}`)
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newX = x + i;
          const newY = y + j;
          if (
            newX >= 0 &&
            newX < 10 &&
            newY >= 0 &&
            newY < 10 &&
            gameboard.gameboard[newX][newY] !== "X"
          ) {
            const attackResult = gameboard.attackShip(newX, newY);
            console.log(attackResult);
            //console.log(attackResult);
            //console.log(gameboard.gameboard);
            //gameboard.gameboard[newX][newY] = "X";
            const cpuGameboard = document.getElementById("cpuBoard");
            const targetCell = cpuGameboard.querySelector(`.cell[data-row="${newX}"][data-col="${newY}"]`);
            if (attackResult === "Hit") {
              targetCell.classList.add("ship-hit"); // Markiere das getroffene Feld
            } 
            if(attackResult === "Miss"){
              targetCell.classList.add("missed-shot");
            }
          }
        }
      }
      console.log(gameboard);
      this.resetCounter();
      return "Captain Astrid destroyed a 3x3 area!";
    }
  }
  
  // Katrin: Zerstört 6 zusätzliche Felder in der Nähe des ursprünglichen Ziels
  class CaptainKatrin extends Captain {
    constructor() {
      super("Katrin", "Destroy 6 additional nearby fields");
    }
  
    useSpecialAbility(gameboard, x, y) {
      if (!this.canUseAbility()) return "Ability not ready!";
      console.log(`Hello, I am ${this.name}`);
  
      const cpuGameboard = document.getElementById("cpuBoard");
      const directions = [
        [-1, 0],  // Oben
        [1, 0],   // Unten
        [0, -1],  // Links
        [0, 1],   // Rechts
        [-1, -1], // Oben links
        [1, 1],   // Unten rechts
      ];
  
      let destroyed = 0;
  
      // Das ausgewählte Feld angreifen
      const attackResult = gameboard.attackShip(x, y);
      //gameboard.gameboard[x][y] = "X"; 
      const targetCell = cpuGameboard.querySelector(`.cell[data-row="${x}"][data-col="${y}"]`);
      if (attackResult === "Hit") {
        targetCell.classList.add("ship-hit");
      } else if (attackResult === "Miss") {
        targetCell.classList.add("missed-shot");
      }
      destroyed++;
  
      // Angrenzende Felder zerstören
      for (const [dx, dy] of directions) {
        const nx = x + (parseInt(dx));
        const ny = y + (parseInt(dy));
        console.log(typeof x,x);
        console.log(typeof y, y);
        if (
          nx >= 0 &&
          nx < 10 &&
          ny >= 0 &&
          ny < 10 &&
          gameboard.gameboard[nx][ny] !== "X"
        ) {
          const adjacentAttackResult = gameboard.attackShip(nx, ny);
          //gameboard.gameboard[nx][ny] = "X";
          const adjacentCell = cpuGameboard.querySelector(`.cell[data-row="${nx}"][data-col="${ny}"]`);
          
          if (adjacentAttackResult === "Hit") {
            adjacentCell.classList.add("ship-hit");
          } else if (adjacentAttackResult === "Miss") {
            adjacentCell.classList.add("missed-shot");
          }
          destroyed++;
          if (destroyed === 7) break; // Zählt das ursprüngliche Feld mit
        }
      }
      
      console.log(gameboard.gameboard);
      this.resetCounter();
      return `Captain Katrin destroyed ${destroyed} fields!`;
    }
  }
  
  export { Captain, CaptainWilliam, CaptainGiuseppe, CaptainAstrid, CaptainKatrin };
  