const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const statsElement = document.getElementById("stats");
const scoreElement = document.getElementById("score");
const colors = [
  "#FF073A", // Neon Red
  "#FF7C00", // Neon Orange
  "#FFFF00", // Neon Yellow
  "#39FF14", // Neon Green
  "#00FFFF", // Neon Light Blue
];

let score = 0;

function gameLoop() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // game update code will go here

  // check if ball is in bounds of any brick
  bricks.forEach((rows) => {
    rows.forEach((brick) => {
      if (brick.isBroken) return;
      handleBrickCollision(brick);
    });
  });

  handlePaddleCollision();
  handleWallCollision();
  draw(drawBall);
  draw(drawPaddle);
  drawBricks();
  handleWinCondition();
  handleLossCondition();

  // sehcudle next game loop
  scoreElement.textContent = `Score: ${score}`;
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // reset recent brick broken

  requestAnimationFrame(gameLoop);
}

// handle conditions

function handleWinCondition() {
  if (score == bricksConfig.rowCount * bricksConfig.columnCount) {
    alert("You won!");
    resetGame();
  }
}

function handleLossCondition() {
  if (ball.y + ball.radius >= canvas.height) {
    alert("Game over!");
    resetGame();
  }
}

function handleWallCollision() {
  if (ball.x < 0 || ball.x > canvas.width) {
    ball.velocityX = -ball.velocityX;
  }
  if (ball.y < 0 || ball.y > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }
}
function handleBrickCollision(brick) {
  if (
    ball.y + ball.radius >= brick.y &&
    ball.y - ball.radius <= brick.y + bricksConfig.height &&
    ball.x + ball.radius >= brick.x &&
    ball.x - ball.radius <= brick.x + bricksConfig.width
  ) {
    ball.velocityY = -ball.velocityY;
    brick.isBroken = true;
    score += 1;
    brickBroken = true;
  }
}

function handlePaddleCollision() {
  if (
    ball.y + ball.radius >= paddle.y &&
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ball.x + ball.radius >= paddle.x &&
    ball.x - ball.radius <= paddle.x + paddle.width
  ) {
    ball.velocityY = -ball.velocityY;
  }
}

// define objects
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velocityX: 2,
  velocityY: 2,
};

const paddle = {
  x: canvas.width / 2,
  y: canvas.height - 20,
  width: 100,
  height: 10,
  velocityX: 2,
};

const bricksConfig = {
  rowCount: 5,
  columnCount: 9,
  width: 54,
  margin: 2,
  height: 16,
  topOffset: 30,
  leftOffset: 50,
};

// create bricks array
const bricks = Array.from({ length: bricksConfig.rowCount }, () =>
  Array.from({ length: bricksConfig.columnCount }, () => ({
    x: 0,
    y: 0,
    isBroken: false,
  }))
);

document.addEventListener("mousemove", movePaddle);

function movePaddle(e) {
  // get boundaries of canvas
  const rect = canvas.getBoundingClientRect();
  if (e.clientX < rect.left || e.clientX > rect.right) return;
  paddle.x = e.clientX - rect.left - paddle.width / 2;
}

// handle drawing

function draw(shape, color = "#cba73bfa") {
  ctx.beginPath();
  shape();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// draw bricks
function drawBricks() {
  bricks.forEach((row, r) => {
    row.forEach((brick, c) => {
      if (!brick.isBroken) {
        brick.x =
          c * (bricksConfig.width + bricksConfig.margin) +
          bricksConfig.leftOffset;
        brick.y =
          r * (bricksConfig.height + bricksConfig.margin) +
          bricksConfig.topOffset;
        draw(() => drawBrick(brick), colors[r]);
      }
    });
  });
}

function drawBall() {
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
}
function drawBrick(brick) {
  ctx.rect(brick.x, brick.y, bricksConfig.width, bricksConfig.height);
}

function drawPaddle() {
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function resetGame() {
  // Reset ball properties
  ball.x = canvas.width / (Math.floor(Math.random() * Math.random() * 10) + 3);
  ball.y = canvas.height / 2;
  ball.velocityX = 2;
  ball.velocityY = 2;

  // Reset paddle position
  paddle.x = (canvas.width - paddle.width) / 2;

  // Reset bricks
  bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.isBroken = false;
    });
  });

  // Reset score
  score = 0;
}

gameLoop();
