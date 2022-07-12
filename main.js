
showHighScores();

function handleKeyPress(event) {
  // Stop the event from bubbling.
  event.preventDefault();

  if (moves[event.keyCode]) {
    // Get new state of gate
    let p = moves[event.keyCode](board.gate);

    if (event.keyCode === KEY.SPACE) {
      // Hard drop
      while (board.valid(p)) {
        board.gate.move(p);
        account.score += POINTS.HARD_DROP;
        p = moves[KEY.SPACE](board.gate);
      }
    }

    if (board.valid(p)) {
      board.gate.move(p);
      if (event.keyCode === KEY.DOWN) {
        account.score += POINTS.SOFT_DROP;
      }
    }
  }
}

function addEventListener() {
  document.removeEventListener('keydown', handleKeyPress);
  document.addEventListener('keydown', handleKeyPress);
}

function draw() {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  board.draw();
  board.gate.draw();
}

function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board = new Board(ctx, ctxNext);
  time = { start: performance.now(), elapsed: 0, level: LEVEL[0] };
}

function play() {
  resetGame();
  addEventListener();

  // If we have an old game running then cancel it
  if (requestId) {
    cancelAnimationFrame(requestId);
  }
  time.start = performance.now();
  animate();
}

time = { start: 0, elapsed: 0, level: 1000 };

function animate(now = 0) {
  // Update elapsed time.
  time.elapsed = now - time.start;

  // If elapsed time has passed time for current level
  if (time.elapsed > time.level) {
    // Restart counting from now
    time.start = now;

    if (!board.drop()) {
      gameOver();
      return;
    }
  }

  draw();
  requestId = requestAnimationFrame(animate);
}

function gameOver() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);

  checkHighScore(account.score);
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];

  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

  if (score > lowestScore) {
    saveHighScore(score, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  const name = prompt('You got a highscore! Enter name:');

  const newScore = { score, name };

  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
};

function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];

  const highScoreList = document.getElementById(HIGH_SCORES);

  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.score} - ${score.name}`)
    .join('');
}
