//import "./css/styles.css";
import { Gameboard } from "./modules/gameboard.js";
//import { Player } from "./modules/player.js";
//import { Ship } from "./modules/ship.js";
import {
  CaptainWilliam,
  CaptainGiuseppe,
  CaptainAstrid,
  CaptainKatrin,
} from "./modules/captains.js";

// DOM Elements
const captainSelect = document.getElementById("captain-dropdown");
const startButton = document.getElementById("startGameBtn");
const gameboardPlayerContainer = document.getElementById("playerBoard");
const gameboardCPUContainer = document.getElementById("cpuBoard");
const infoCaptainSelected = document.getElementById("selected-captain");
const specialAbilityButton = document.getElementById("useAbilityBtn");

// Game variables
let selectedCaptain = null;
let gameboardPlayer = new Gameboard();
let gameboardCPU = new Gameboard();
let turn = "player";

// Event Listener for captain selection
captainSelect.addEventListener("change", (event) => {
  selectedCaptain = event.target.value;
  startButton.disabled = !selectedCaptain; // Enable button if a captain is selected
});

// Event Listener for Start Game button
startButton.addEventListener("click", () => {
  if (!selectedCaptain) return alert("Please select a captain first!");

  switch (selectedCaptain) {
    case "William":
      selectedCaptain = new CaptainWilliam();
      break;
    case "Giuseppe":
      selectedCaptain = new CaptainGiuseppe();
      break;
    case "Astrid":
      selectedCaptain = new CaptainAstrid();
      break;
    case "Katrin":
      selectedCaptain = new CaptainKatrin();
      break;
  }

  infoCaptainSelected.textContent = selectedCaptain.name;

  // Create player gameboard and render it
  gameboardPlayer.createGameboard();
  gameboardPlayer.createShipsCPU(); // Für den Spieler
  gameboardPlayer.placeShipsCPU(); // Für den Spieler
  renderGameboard(gameboardPlayer.gameboard, gameboardPlayerContainer);

  // Create CPU gameboard and render it
  gameboardCPU.createGameboard();
  gameboardCPU.createShipsCPU(); // Für die CPU
  gameboardCPU.placeShipsCPU(); // Für die CPU
  renderGameboard(gameboardCPU.gameboard, gameboardCPUContainer);

  // Hide captain selection and show gameboard
  document.getElementById("captain-selection").style.display = "none";
  gameboardPlayerContainer.style.display = "grid";
  gameboardCPUContainer.style.display = "grid";
  console.log(gameboardCPU.gameboard);
  console.log(gameboardPlayer.gameboard);
});

function switchTurn() {
  turn = turn === "player" ? "cpu" : "player";
  updateTurnDisplay();
  if (turn === "player" && selectedCaptain) {
    selectedCaptain.reduceCounter();
    updateSpecialAbilityButton(); // Aktualisiert den Zustand des Buttons
  }

  if (turn === "cpu") {
    deactivateCPUBoard();
    cpuTurn();
  }
}

function deactivateCPUBoard() {
  gameboardCPUContainer.classList.add("deactivated");
}

function reactivateCPUBoard() {
  gameboardCPUContainer.classList.remove("deactivated");
}

function updateTurnDisplay() {
  const turnDisplay = document.getElementById("turnDisplay");
  if (turn === "player") {
    turnDisplay.textContent = "Your turn!";
  } else {
    turnDisplay.textContent = "CPU is attacking!";
  }
}

// Function to render the gameboard
function renderGameboard(gameboard, container) {
  container.innerHTML = ""; // Clear any existing content

  const isPlayerBoard = gameboard === gameboardPlayer.gameboard;

  gameboard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.dataset.row = rowIndex;
      cellDiv.dataset.col = colIndex;

      if (!isPlayerBoard) {
        cellDiv.addEventListener("click", handleAttack);
      }

      if (isPlayerBoard && cell !== 0) {
        cellDiv.classList.add("ship");
      }
      container.appendChild(cellDiv);
    });
  });
}

function handleAttack(event) {
  if (turn !== "player") return;

  const targetCell = event.target;
  const row = parseInt(targetCell.dataset.row);
  const col = parseInt(targetCell.dataset.col);

  if(gameboardCPU.gameboard[row][col] === "O" || 
    gameboardCPU.gameboard[row][col] === "X" 
    ){
    return;
  }

  const attackResult = gameboardCPU.attackShip(row, col);

  if (attackResult === "Hit") {
    targetCell.classList.add("ship-hit");
  } else if (attackResult === "Miss") {
    targetCell.classList.add("missed-shot");
  }
  checkForWinner();

  switchTurn();
}

function cpuTurn() {
  if (turn !== "cpu") return;


  // Verzögerung von 1 Sekunden
  setTimeout(() => {
    let row, col;
    // Zufällige Zelle auswählen
    do{
    row = Math.floor(Math.random() * gameboardPlayer.gameboard.length);
    col = Math.floor(Math.random() * gameboardPlayer.gameboard[0].length);
    } while (gameboardPlayer.gameboard[row][col] === "O" || gameboardPlayer.gameboard[row][col] === "X");

    // Angriff auf die ausgewählte Zelle
    const attackResult = gameboardPlayer.attackShip(row, col);

    const playerBoard = document.getElementById("playerBoard");
    const cellDiv = playerBoard.querySelector(
      `[data-row='${row}'][data-col='${col}']`
    );

    if (attackResult === "Hit") {
      cellDiv.classList.add("ship-hit");
    } else if (attackResult === "Miss") {
      cellDiv.classList.add("missed-shot");
    }
    checkForWinner();
    reactivateCPUBoard();
    // Wechsel zum nächsten Zug nach der Verzögerung
    switchTurn();
  }, 1000); // 1000 Millisekunden = 1 Sekunden
}

function checkForWinner() {
  const playerShipsSunk = gameboardPlayer.ships.every(
    (ship) => ship.getTimesHit() === ship.getShipLength()
  );
  setTimeout(() => {
    if (playerShipsSunk) {
      alert("CPU wins! All player ships are sunk.");
      location.reload();
      //resetGame(); // Option: Spiel zurücksetzen
      return;
    }
  }, 500);
  const cpuShipsSunk = gameboardCPU.ships.every(
    (ship) => ship.getTimesHit() === ship.getShipLength()
  );
  setTimeout(() => {
    if (cpuShipsSunk) {
      alert("Player wins! All CPU ships are sunk");
      location.reload();
      //resetGame();
      return;
    }
  }, 500);
}

/* function resetGame() {
  // Setze alle relevanten Variablen zurück
  turn = "player"; 
  gameboardPlayer.reset();
  gameboardCPU.reset();

  // Entferne Inhalte und Klassen aus den Gameboard-Containern
  gameboardPlayerContainer.innerHTML = "";
  gameboardCPUContainer.innerHTML = "";

  // Zeige die Captain-Auswahl erneut
  document.getElementById("captain-selection").style.display = "block";
  gameboardPlayerContainer.style.display = "none";
  gameboardCPUContainer.style.display = "none";

  // Entferne den aktuell ausgewählten Captain
  selectedCaptain = null;
} */

function updateSpecialAbilityButton() {
  const button = document.getElementById("useAbilityBtn");
  button.disabled = !selectedCaptain.canUseAbility();
}

document.getElementById("useAbilityBtn").addEventListener("click", () => {
  if (!selectedCaptain.canUseAbility()) {
    alert("Special ability not ready yet!");
    return;
  }

  if (selectedCaptain.name === "Astrid") {
    const x = prompt("Enter X coordinate:");
    const y = prompt("Enter Y coordinate:");
    const result = selectedCaptain.useSpecialAbility(
      gameboardCPU,
      parseInt(x),
      parseInt(y)
    );
    console.log(result);
  } else if (selectedCaptain.name === "William") {
    const choice = prompt("Enter 'row' or 'column':").toLowerCase();
    if (choice !== "row" && choice !== "column") {
      alert("Invalid input! Please enter 'row' or 'column'.");
      return;
    }
    const index = parseInt(prompt(`Enter the ${choice} number (0-9):`));
    if (isNaN(index) || index < 0 || index > 9) {
      alert("Invalid input! Please enter a number between 0 and 9.");
      return;
    }
    const result = selectedCaptain.useSpecialAbility(
      gameboardCPU,
      choice,
      index
    );
    console.log(result);
  } else if (selectedCaptain.name === "Giuseppe") {
    selectedCaptain.useSpecialAbility(gameboardCPU);
  } else if (selectedCaptain.name === "Katrin") {
    const x = prompt("Enter X coordinate:");
    const y = prompt("Enter Y coordinate:");
    selectedCaptain.useSpecialAbility(gameboardCPU, parseInt(x), parseInt(y));
  }
  console.log(gameboardCPU.gameboard);
  checkForWinner();
  updateSpecialAbilityButton(); // Button aktualisieren
});
