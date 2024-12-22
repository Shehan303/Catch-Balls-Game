const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let balls = [];
let score = 0;
let timer = 60;
let gameInterval, countdownInterval;
let isPaused = false;

// Paddle properties
const paddle = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 20,
  width: 100,
  height: 10,
  dx: 0,
  speed: 15,
};

const winScore =200;

// DOM elements
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const newGameButton = document.getElementById("new-game");
const pauseGameButton = document.getElementById("pause-game");
const resumeGameButton = document.getElementById("resume-game");
const stopGameButton = document.getElementById("stop-game");

// Functions
function initializeGame() {
  balls = [];
  score = 0;
  timer = 60;
  isPaused = false;
  scoreElement.textContent = score;
  timerElement.textContent = timer;
}

function startCountdown() {
  countdownInterval = setInterval(() => {
    if (timer > 0) {
      timer--;
      timerElement.textContent = timer;
    } else {
      clearInterval(countdownInterval);
      stopGame();
      alert(`Game Over! Your final score is ${score}`);
    }
  }, 1000);
}

function addBall() {
  // Randomly assign color and score
  const colors = [
    { color: "red", points: 5 },
    { color: "yellow", points: 3 },
    { color: "blue", points: 1 },
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  balls.push({
    x: Math.random() * canvas.width,
    y: 0,
    radius: 10,
    dy: 2 + Math.random() * 2,
    color: randomColor.color,
    points: randomColor.points,
  });
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function moveBalls() {
  balls.forEach((ball, index) => {
    ball.y += ball.dy;

    // Check if ball hits the paddle
    if (
      ball.y + ball.radius >= paddle.y &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      score += ball.points; // Add points based on ball's color
      scoreElement.textContent = score;
      balls.splice(index, 1); // Remove the ball
    }

    // Remove ball if it falls off the screen
    if (ball.y - ball.radius > canvas.height) {
      balls.splice(index, 1);
    }
  });
}

function drawPaddle() {
  ctx.fillStyle = "green";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function movePaddle() {
  paddle.x += paddle.dx;

  // Prevent paddle from moving off the canvas
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle();
  movePaddle();

  balls.forEach(drawBall);
  moveBalls();

  if (Math.random() < 0.03) {
    addBall();
  }

  checkWinCondition();
}

function checkWinCondition() {
  if (score >= winScore) {
    stopGame();
    alert(`You win! Your final score is ${score}`);
  }
}

function startGame() {
  if (gameInterval) clearInterval(gameInterval);
  if (countdownInterval) clearInterval(countdownInterval);

  initializeGame();
  startCountdown();
  gameInterval = setInterval(() => {
    if (!isPaused) {
      gameLoop();
    }
  }, 16);
}

function pauseGame() {
  isPaused = true;
}

function resumeGame() {
  isPaused = false;
}

function stopGame() {
  clearInterval(gameInterval);
  clearInterval(countdownInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Event Listeners
newGameButton.addEventListener("click", startGame);
stopGameButton.addEventListener("click", stopGame);
pauseGameButton.addEventListener("click", pauseGame);
resumeGameButton.addEventListener("click", resumeGame);

// Listen for keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  } else if (e.code === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.code === "Space") {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
    paddle.dx = 0;
  }
});
