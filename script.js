const canvas = document.getElementById("myCanvas");
const hintParagraph = document.getElementById("hint_paragraph");

const fieldScreenPercentage = 0.8;
let width = window.innerWidth * fieldScreenPercentage;
let height = window.innerHeight * fieldScreenPercentage;

if (width > height) {
  width = height;
} else {
  height = width;
}
canvas.width = width;
canvas.height = height;
const cellSize = width / 3;

const imgX = new Image();
const imgO = new Image();

let field;
let context;

function drawCell(x, y) {
  if (!canvas) return;
  context.fillRect(x, y, cellSize, cellSize);
}

function drawImage(img, x, y, imageScale = 0.8) {
  if (!canvas) return;

  context.drawImage(
    img,
    x + (cellSize * (1 - imageScale)) / 2,
    y + (cellSize * (1 - imageScale)) / 2,
    cellSize * imageScale,
    cellSize * imageScale
  );
}

function initField() {
  field = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];
  if (canvas) {
    context = canvas.getContext("2d");
    context.fillStyle = "rgb(236,238,212)";

    drawCell(0, 0);
    drawCell(2 * cellSize, 0);
    drawCell(cellSize, cellSize);
    drawCell(0, 2 * cellSize);
    drawCell(2 * cellSize, 2 * cellSize);
    context.fillStyle = "rgb(116,150,84)";
    drawCell(cellSize, 0);
    drawCell(0, cellSize);
    drawCell(2 * cellSize, cellSize);
    drawCell(cellSize, 2 * cellSize);
  }

  if (Math.floor(Math.random() * 2) == 1) {
    const xBestMove = getBestMove(field, "x");
    field[xBestMove.x][xBestMove.y] = "x";
    drawImage(imgX, xBestMove.x * cellSize, xBestMove.y * cellSize);
    const oBestMove = getBestMove(field, "o");
    const oHintText =
      "Best Move for o is: (" +
      oBestMove.x +
      "|" +
      oBestMove.y +
      ") expected to " +
      (oBestMove.winner == "o"
        ? "win"
        : oBestMove.winner == "d"
        ? "draw"
        : "lose");
    hintParagraph.textContent = oHintText;
  } else {
    hintParagraph.textContent = "You to move";
  }
}

imgX.onload = initField;

imgO.src = "./o.svg";
imgX.src = "./x.svg";

function makeMove(player, x, y) {
  if (field[x][y] != "-") return false;
  field[x][y] = player;
  drawImage(player == "o" ? imgO : imgX, x * cellSize, y * cellSize);
  return true;
}

if (canvas) {
  let canvasBoundingRect = canvas.getBoundingClientRect();
  canvas.addEventListener(
    "click",
    function (event) {
      const xCanvasCoordinate = event.pageX - canvasBoundingRect.left;
      const yCanvasCoordinate = event.pageY - canvasBoundingRect.top;
      const x = Math.floor(xCanvasCoordinate / cellSize);
      const y = Math.floor(yCanvasCoordinate / cellSize);

      if (isGameOver(field) != "-") {
        initField();
        return;
      }

      if (!makeMove("o", x, y)) return;

      if (isGameOver(field) == "-") {
        const bestMoveX = getBestMove(field, "x");
        makeMove("x", bestMoveX.x, bestMoveX.y);
      }
      const gameOverState = isGameOver(field);
      if (gameOverState == "-") {
        const bestMoveO = getBestMove(field, "o");
        hintParagraph.textContent =
          "Best Move for o is: (" +
          bestMoveO.x +
          "|" +
          bestMoveO.y +
          ") expected to " +
          (bestMoveO.winner == "o"
            ? "win"
            : bestMoveO.winner == "d"
            ? "draw"
            : "lose");
        return;
      }
      hintParagraph.textContent =
        (gameOverState == "o"
          ? "You WIN!"
          : gameOverState == "x"
          ? "You Lose!"
          : "Draw.") + " \tclick Canvas to play again";
    },
    false
  );
}

function isGameOver(pos) {
  var player;
  for (var i = 0; i < 3; i++) {
    player = pos[i][0];
    if (player == "-") continue;
    if (pos[i][1] != player || pos[i][2] != player) continue;
    return player;
  }
  for (var i = 0; i < 3; i++) {
    player = pos[0][i];
    if (player == "-") continue;
    if (pos[1][i] != player || pos[2][i] != player) continue;
    return player;
  }
  player = pos[1][1];
  if (
    (pos[0][0] == player && pos[2][2] == player) ||
    (pos[2][0] == player && pos[0][2] == player)
  ) {
    return player;
  }
  //check for full field
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (pos[i][j] == "-") {
        return "-";
      }
    }
  }
  return "d";
}

function getBestMove(pos, player) {
  var ret = {};
  var retZustand = "u"; //u undefined l lose w win d draw
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (pos[i][j] != "-") continue;
      pos[i][j] = player;

      var status = isGameOver(pos);
      if (status == "-") {
        var z = getBestMove(pos, player == "x" ? "o" : "x");
        pos[i][j] = "-";
        if (z.winner == player) {
          ret.x = i;
          ret.y = j;
          ret.winner = player;
          return ret;
        }
        if (z.winner == "d") {
          if (retZustand == "u" || retZustand == "l") {
            retZustand = "d";
            ret.x = i;
            ret.y = j;
            ret.winner = "d";
          }
        }
        if (retZustand == "u") {
          retZustand = "l";
          ret.x = i;
          ret.y = j;
          ret.winner = player == "x" ? "o" : "x";
        }
        continue;
      }
      pos[i][j] = "-";
      if (status == player) {
        ret.x = i;
        ret.y = j;
        ret.winner = player;
        return ret;
      }
      if (status == "d") {
        if (retZustand == "u" || retZustand == "l") {
          retZustand = "d";
          ret.x = i;
          ret.y = j;
          ret.winner = "d";
        }
        continue;
      }
      if (retZustand == "u") {
        retZustand = "l";
        ret.x = i;
        ret.y = j;
        ret.winner = player == "x" ? "o" : "x";
      }
    }
  }
  return ret;
}

if (module) {
  module.exports = { isGameOver, getBestMove };
}
