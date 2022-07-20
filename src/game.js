import {
  HIGH_SCORES,
  LEVEL,
  KEY,
  NO_OF_HIGH_SCORES,
  POINTS,
  moves,
} from "./constants.js";
import { Board } from "./board.js";

export class Game {
  constructor() {
    this.board = null;
    this.requestId = null;
    this.ctx = Board.createBoardCanvasContext();
    this.ctxNext = Board.createNextCanvasContext();
    this.accountValues = {
      score: 0,
      gates: 0,
      level: 0,
    };
    this.account = new Proxy(this.accountValues, {
      set: (target, key, value) => {
        target[key] = value;
        this.updateAccount(key, value);
        return true;
      },
    });
    this.time = { start: 0, elapsed: 0, level: 1000 };
  }

  play() {
    this.resetGame();
    this.addEventListener();

    // If we have an old game running then cancel it
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
    this.time.start = performance.now();
    this.animate();
  }

  addEventListener() {
    document.removeEventListener("keydown", this.handleKeyPress.bind(this));
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  handleKeyPress(event) {
    // Stop the event from bubbling.
    event.preventDefault();

    if (moves[event.keyCode]) {
      // Get new state of gate
      let gate = moves[event.keyCode](this.board);

      if (event.keyCode === KEY.SPACE) {
        // Hard drop
        while (this.board.valid(gate)) {
          this.board.gate.move(gate);
          this.account.score += POINTS.HARD_DROP;
          gate = moves[KEY.SPACE](this.board);
        }
      }

      if (this.board.valid(gate)) {
        this.board.gate.move(gate);
        if (event.keyCode === KEY.DOWN) {
          this.account.score += POINTS.SOFT_DROP;
        }
      }
    }
  }

  updateAccount(key, value) {
    let element = document.getElementById(key);
    if (element) {
      element.textContent = value;
    }
  }

  resetGame() {
    this.account.score = 0;
    this.account.gates = 0;
    this.account.level = 0;
    this.board = new Board(this.ctx, this.ctxNext);
    this.time = { start: performance.now(), elapsed: 0, level: LEVEL[0] };
  }

  animate(now = 0) {
    // Update elapsed time.
    this.time.elapsed = now - this.time.start;

    // If elapsed time has passed time for current level
    if (this.time.elapsed > this.time.level) {
      // Restart counting from now
      this.time.start = now;

      if (!this.board.drop(this.account, this.time)) {
        this.gameOver();
        return;
      }
    }

    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  gameOver() {
    cancelAnimationFrame(this.requestId);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(1, 3, 8, 1.2);
    this.ctx.font = "1px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.fillText("GAME OVER", 1.8, 4);

    this.checkHighScore(this.account.score);
  }

  draw() {
    const { width, height } = this.ctx.canvas;

    this.ctx.clearRect(0, 0, width, height);
    this.board.draw();
    this.board.gate.draw(this.ctx);
  }

  checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

    if (score > lowestScore) {
      this.saveHighScore(score, highScores);
      this.showHighScores();
    }
  }

  saveHighScore(score, highScores) {
    const name = prompt("You got a highscore! Enter name:");
    const newScore = { score, name };

    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(NO_OF_HIGH_SCORES);

    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
  }

  showHighScores() {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
    const highScoreList = document.getElementById(HIGH_SCORES);

    highScoreList.innerHTML = highScores
      .map((score) => `<li>${score.score} - ${score.name}</li>`)
      .join("");
  }
}
