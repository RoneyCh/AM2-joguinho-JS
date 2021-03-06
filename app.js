let myGamePiece,
  myScore,
  gameOverText,
  winText,
  myObstacles = [],
  scoreValue = 0,
  piecesPassed = 0,
  levelValue = 1,
  intervaloObstaculos = 50;
function startGame() {
  (document.getElementById("lvl").innerHTML =
    "N\xEDvel: " + parseInt(piecesPassed / 100)),
    (document.getElementById("vel").innerHTML =
      "Velocidade dos obst\xE1culos: " + parseInt(intervaloObstaculos)),
    (myGamePiece = new component(30, 30, "red", 10, 120)),
    (myGamePiece.gravity = 0),
    (myScore = new component("30px", "Consolas", "black", 280, 40, "text")),
    (gameOverText = new component(
      "30px",
      "Consolas",
      "black",
      240,
      135,
      "text"
    )),
    (winText = new component("30px", "Consolas", "black", 240, 135, "text")),
    myGameArea.start();
}
document.addEventListener("keydown", (a) => {
  "w" === a.key && (a.preventDefault(), (myGamePiece.speedY = -1)),
    "a" === a.key && (a.preventDefault(), (myGamePiece.speedX = -1)),
    "s" === a.key && (a.preventDefault(), (myGamePiece.speedY = 1)),
    "d" === a.key && (a.preventDefault(), (myGamePiece.speedX = 1));
}),
  document.addEventListener("keyup", (a) => {
    "w" === a.key && (a.preventDefault(), (myGamePiece.speedY = 0)),
      "a" === a.key && (a.preventDefault(), (myGamePiece.speedX = 0)),
      "s" === a.key && (a.preventDefault(), (myGamePiece.speedY = 0)),
      "d" === a.key && (a.preventDefault(), (myGamePiece.speedX = 0));
  });
let myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    (this.canvas.width = 860),
      (this.canvas.height = 300),
      (this.context = this.canvas.getContext("2d")),
      document.body.insertBefore(this.canvas, document.body.childNodes[0]),
      (this.frameNo = 0),
      (this.interval = setInterval(updateGameArea, 20));
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};
function component(a, b, c, d, e, f) {
  (this.type = f),
    (this.score = 0),
    (this.width = a),
    (this.height = b),
    (this.speedX = 0),
    (this.speedY = 0),
    (this.x = d),
    (this.y = e),
    (this.gravity = 0),
    (this.gravitySpeed = 0),
    (this.update = function () {
      (ctx = myGameArea.context),
        "text" == this.type
          ? ((ctx.font = this.width + " " + this.height),
            (ctx.fillStyle = c),
            ctx.fillText(this.text, this.x, this.y))
          : ((ctx.fillStyle = c),
            ctx.fillRect(this.x, this.y, this.width, this.height));
    }),
    (this.newPos = function () {
      (this.gravitySpeed += this.gravity),
        (this.x += this.speedX),
        (this.y += this.speedY + this.gravitySpeed),
        this.hitBottom();
    }),
    (this.hitBottom = function () {
      let a = myGameArea.canvas.height - this.height;
      this.y > a && ((this.y = a), (this.gravitySpeed = 0));
    }),
    (this.crashWith = function (a) {
      let b = this.x,
        c = this.x + this.width,
        d = this.y,
        e = this.y + this.height,
        f = a.x,
        g = a.x + a.width,
        h = a.y,
        j = a.y + a.height,
        k = !0;
      return (e < h || d > j || c < f || b > g) && (k = !1), k;
    }),
    (this.passed = function (a) {
      let b = this.x + this.width;
      return b > a.x;
    });
}
function updateGameArea() {
  if (
    myObstacles.length > piecesPassed &&
    myGamePiece.crashWith(myObstacles[piecesPassed]) &&
    0 == scoreValue
  )
    return (gameOverText.text = "Game Over!!"), void gameOverText.update();
  if (100 == scoreValue && 20 == intervaloObstaculos)
    return (winText.text = "GANHOU!"), void winText.update();
  let a;
  for (
    myGameArea.clear(),
      myGameArea.frameNo += 1,
      (1 == myGameArea.frameNo || everyinterval(intervaloObstaculos)) &&
        ((a = myGameArea.canvas.width),
        myObstacles.push(
          new component(20, 20, "blue", a, 270 * Math.random())
        )),
      i = 0;
    i < myObstacles.length;
    i += 1
  )
    (myObstacles[i].x += -3), myObstacles[i].update();
  if (myObstacles.length > piecesPassed)
    if (myGamePiece.crashWith(myObstacles[piecesPassed])) {
      if (0 == scoreValue) return;
      (scoreValue -= 1),
        (piecesPassed += 1),
        20 !== intervaloObstaculos &&
          0 == piecesPassed % 100 &&
          ((levelValue += 1),
          (scoreValue = 0),
          (piecesPassed = 0),
          (myObstacles = []),
          (intervaloObstaculos -= 15),
          startGame());
    } else
      myGamePiece.passed(myObstacles[piecesPassed]) &&
        ((scoreValue += 1),
        (piecesPassed += 1),
        20 !== intervaloObstaculos &&
          0 == piecesPassed % 100 &&
          ((levelValue += 1),
          (scoreValue = 0),
          (piecesPassed = 0),
          (myObstacles = []),
          (intervaloObstaculos -= 15),
          startGame()));
  (document.getElementById("lvl").innerHTML = "N\xEDvel: " + levelValue),
    (document.getElementById("vel").innerHTML =
      "Aproxima????o dos obst\xE1culos: " + intervaloObstaculos),
    (myScore.text = "SCORE: " + scoreValue),
    myScore.update(),
    myGamePiece.newPos(),
    myGamePiece.update();
}
function everyinterval(a) {
  return !(0 != (myGameArea.frameNo / a) % 1);
}
function accelerate(a) {
  myGamePiece.gravity = a;
}
