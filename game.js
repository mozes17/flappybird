const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Madár beállításai
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 5,
    gravity: 0.25,
    jumpPower: 5,
    image: new Image(),
};

// Betöltjük a madár képét
bird.image.src = "bird.png";

// Akadályok beállításai
const obstacles = [];
const obstacleWidth = 50;
const obstacleGap = 200;
const obstacleSpeed = 2;

let score = 0;

function drawBird() {
    ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

function drawObstacles() {
    ctx.fillStyle = "blue";
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, 0, obstacleWidth, obstacles[i].topHeight);
        ctx.fillRect(obstacles[i].x, obstacles[i].bottomY, obstacleWidth, obstacles[i].bottomHeight);
    }
}

function collisionDetection() {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            bird.x + bird.width > obstacles[i].x &&
            bird.x < obstacles[i].x + obstacleWidth &&
            (bird.y < obstacles[i].topHeight || bird.y + bird.height > obstacles[i].bottomY)
        ) {
            return true;
        }
    }
    return false;
}

function updateScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 20, 30);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (collisionDetection()) {
        alert("Game Over! Score: " + score);
        document.location.reload();
    }

    bird.y += bird.speed;
    bird.speed += bird.gravity;

    if (bird.y > canvas.height) {
        bird.speed = 0;
        bird.y = canvas.height;
    }

    if (bird.y < 0) {
        bird.speed = 0;
        bird.y = 0;
    }

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - obstacleGap) {
        const topHeight = Math.random() * (canvas.height / 2) + 50;
        const bottomY = topHeight + obstacleGap;
        const bottomHeight = canvas.height - bottomY;
        obstacles.push({ x: canvas.width, topHeight, bottomY, bottomHeight });
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;
        if (obstacles[i].x + obstacleWidth < 0) {
            obstacles.shift();
            score++;
        }
    }

    drawBird();
    drawObstacles();
    updateScore();

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function (e) {
    if (e.keyCode === 32) {
        bird.speed = -bird.jumpPower;
    }
});

gameLoop();
