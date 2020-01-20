import Game from "./engine/game.js";

const $wholepage = $(document);
const $root = $("#root");

let length = 4;
let game = new Game(length);

$(function() {
  setupGameView();
});
function setupGameView() {
  let instructions =
    '<div id="instructions">Use the arrow keys on your keyboard to control the direction that the gameboard moves. Goal is to merge the tiles on the board until you get 2048</div>';

  $root.append(instructions);
  $root.append(renderResetButton());
  $root.append(renderBoard());
  $root.append(renderScore());
  $root.append('<div id="status"></div>');

  $wholepage.keydown(handleKeyPress);
  $("#reset-btn").on("click", handleResetButtonPress);
}

function handleKeyPress(event) {
  let input = event.keyCode;

  switch (input) {
    case 38:
      game.move("up");
      break;
    case 40:
      game.move("down");
      break;
    case 37:
      game.move("left");
      break;
    case 39:
      game.move("right");
      break;
  }

  $("#board").remove();
  $("#score-div").remove();
  $root.append(renderBoard());
  $root.append(renderScore());

  if (game.getGameState().over) {
    $("#status").text("You lose!");
  } else if (game.getGameState().won) {
    $("#status").text("You win!");
  }
}

function handleResetButtonPress(event) {
  game.setupNewGame();

  $("#board").remove();
  $("#score-div").remove();
  $("#status").text("");

  $root.append(renderBoard());
  $root.append(renderScore());
}

function board2D(arr) {
    var newArr = [];
    while(arr.length) newArr.push(arr.splice(0,game.size));
    return newArr;
}

function renderBoard() {
    let boardRows = "";
    let hold = board2D(game.getGameState().board);
  for (let i = 0; i < game.getSize(); i++) {
    boardRows += '<div class="tile-row">\n';
    
    for (let j = 0; j < game.getSize(); j++) {
      if (hold[i][j] != 0) {
        boardRows +=
          `<div class="tile" id = "${hold[i][j]}" ><p class="tile-value">` +
          hold[i][j] +
          "</p></div>";
      } else {
        boardRows += '<div class="tile" ><p class="tile-value">&nbsp;</p></div>';
      }
    }

    boardRows += "</div>\n";
  }

  let boardView = '<div id="board">' + boardRows + "</div>";
  return boardView;
}

function renderScore() {
  let score = game.getGameState().score;

  return '<div id="score-div"> Score: ' + score + "</div>";
}

function renderResetButton() {
  return '<button id="reset-btn">Make New Game</button>';
}

