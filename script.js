const canvas = document.getElementById("myCanvas");
const hintParagraph = document.getElementById("hint_paragraph");

const imgX = new Image();
const imgO = new Image();

let field;
let context;

function initField() {
  field = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];
  if (canvas) {
    context = canvas.getContext("2d");
    context.fillStyle = "rgb(236,238,212)";
    context.fillRect(0, 0, 300, 300);
    context.fillRect(600, 0, 300, 300);
    context.fillRect(300, 300, 300, 300);
    context.fillRect(0, 600, 300, 300);
    context.fillRect(600, 600, 300, 300);
    context.fillStyle = "rgb(116,150,84)";
    context.fillRect(300, 0, 300, 300);
    context.fillRect(0, 300, 300, 300);
    context.fillRect(600, 300, 300, 300);
    context.fillRect(300, 600, 300, 300);
  }

  if (Math.floor(Math.random() * 2) == 1) {
    const xBestMove = getBestMove(field, "x");
    field[xBestMove.x][xBestMove.y] = "x";
    context.drawImage(imgX, xBestMove.x * 300, xBestMove.y * 300);
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

imgO.src = "./o.png";
imgX.src = "./x.png";

if (canvas) {
  let canvasBoundingRect = canvas.getBoundingClientRect();
  canvas.addEventListener(
    "click",
    function (event) {
      var xVal = event.pageX - canvasBoundingRect.left,
        yVal = event.pageY - canvasBoundingRect.top;
      var x = Math.floor(xVal / 300);
      var y = Math.floor(yVal / 300);
      var over = isGameOver(field);
      if (field[x][y] == "-" && over == "-") {
        field[x][y] = "o";
        context.drawImage(imgO, x * 300, y * 300);
        over = isGameOver(field);
        if (over == "-") {
          var ret = getBestMove(field, "x");
          //console.log(ret);
          field[ret.x][ret.y] = "x";
          context.drawImage(imgX, ret.x * 300, ret.y * 300);
          over = isGameOver(field);
          if (over == "-") {
            ret = getBestMove(field, "o");
            var txt =
              "Best Move for o is: (" +
              ret.x +
              "|" +
              ret.y +
              ") expected to " +
              (ret.winner == "ox"
                ? "win"
                : ret.winner == "d"
                ? "draw"
                : "lose");
            hintParagraph.textContent = txt;
          }
        }
        if (over != "-") {
          hintParagraph.textContent =
            (over == "o" ? "You WIN!" : over == "x" ? "You Lose!" : "Draw.") +
            " \tclick Canvas to play again";
        }
      } else {
        if (over != "-") {
          initField();
        }
      }
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
  var retZustand = "u"; //u undifined l lose w win d draw
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (pos[i][j] != "-") continue;
      pos[i][j] = player;
      //printPos(pos);
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
