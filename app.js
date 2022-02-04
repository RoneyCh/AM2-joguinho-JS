let myGamePiece;
let myObstacles = [];
let myScore;
let gameOverText;
let winText;
let scoreValue = 0;
let piecesPassed = 0;
let levelValue = 1;

let intervaloObstaculos = 50;



function startGame() {
    document.getElementById("lvl").innerHTML = "Nível: " + parseInt(piecesPassed / 100);
    document.getElementById("vel").innerHTML = "Velocidade dos obstáculos: " + parseInt(intervaloObstaculos);
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    gameOverText = new component("30px", "Consolas", "black", 240, 135, "text");
    winText = new component("30px", "Consolas", "black", 240, 135, "text");
    myGameArea.start();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        event.preventDefault();
        myGamePiece.speedY = -1
    }
    if (event.key === 'a') {
        event.preventDefault();
        myGamePiece.speedX = -1;
    }
    if (event.key === 's') {
        event.preventDefault();
        myGamePiece.speedY = 1;
    }
    if (event.key === 'd') {
        event.preventDefault();
        myGamePiece.speedX = 1;
    }
})

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') {
        event.preventDefault();
        myGamePiece.speedY = 0
    }
    if (event.key === 'a') {
        event.preventDefault();
        myGamePiece.speedX = 0;
    }
    if (event.key === 's') {
        event.preventDefault();
        myGamePiece.speedY = 0;
    }
    if (event.key === 'd') {
        event.preventDefault();
        myGamePiece.speedX = 0;
    }
})


let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 860;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        let rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        let myleft = this.x;
        let myright = this.x + (this.width);
        let mytop = this.y;
        let mybottom = this.y + (this.height);
        let otherleft = otherobj.x;
        let otherright = otherobj.x + (otherobj.width);
        let othertop = otherobj.y;
        let otherbottom = otherobj.y + (otherobj.height);
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    this.passed = function(otherobj) {
        let myright = this.x + (this.width);
        return myright > otherobj.x;
    }
}

function updateGameArea() {
    if (myObstacles.length > piecesPassed && myGamePiece.crashWith(myObstacles[piecesPassed]) && scoreValue == 0) {
        gameOverText.text = "Game Over!!";
        gameOverText.update();
        return;
    }
    if (scoreValue == 100 && intervaloObstaculos == 20) {
        winText.text = "GANHOU!";
        winText.update();
        return;
    }
    let x;
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(intervaloObstaculos)) {
        x = myGameArea.canvas.width;
        myObstacles.push(new component(20, 20, "blue", x, Math.random() * 270));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -3;
        myObstacles[i].update();
    }
    
    if (myObstacles.length > piecesPassed) {
        if (myGamePiece.crashWith(myObstacles[piecesPassed])) {
            if (scoreValue == 0) {
                return;
            }
            scoreValue -= 5;
            piecesPassed += 1
            if (intervaloObstaculos !== 20) {
                if (piecesPassed % 20 == 0) {
                    levelValue += 1;
                    scoreValue = 0;
                    piecesPassed = 0;
                    myObstacles = []
                    intervaloObstaculos -= 15;
                    startGame();
                }
            }
        } else if (myGamePiece.passed(myObstacles[piecesPassed])) {
            scoreValue += 5;
            piecesPassed += 1;
            if (intervaloObstaculos !== 20) {
                if (piecesPassed % 20 == 0) {
                    levelValue += 1;
                    scoreValue = 0;
                    piecesPassed = 0;
                    myObstacles = []
                    intervaloObstaculos -= 15;
                    startGame();
                }
            }
        }
        
    }
    document.getElementById("lvl").innerHTML = "Nível: " + levelValue;
    document.getElementById("vel").innerHTML = "Velocidade dos obstáculos: " + intervaloObstaculos;
    myScore.text = "SCORE: " + scoreValue;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}