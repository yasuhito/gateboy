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
    this.requestBlockDropAnimationId = null;
    this.requestGateReductionAnimationId = null;
    this.requestGateDropAnimationId = null;
    this.reducingGates = false;
    this.droppingGates = false;
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
        this._updateAccount(key, value);
        return true;
      },
    });
    this.time = {
      startBlockDrop: 0,
      elapsedBlockDrop: 0,
      startGateReduction: 0,
      elapsedReduction: 0,
      startGateDrop: 0,
      elapsedGateDrop: 0,
      level: 1000,
    };
  }

  play() {
    this._resetGame();
    this._addKeydownEventListener();

    // If we have an old game running then cancel it
    if (this.requestBlockDropAnimationId) {
      cancelAnimationFrame(this.requestBlockDropAnimationId);
    }
    this.time.startBlockDrop = performance.now();
    this._animateBlockDrop();
  }

  _addKeydownEventListener() {
    document.removeEventListener("keydown", this._handleKeyPress.bind(this));
    document.addEventListener("keydown", this._handleKeyPress.bind(this));
  }

  _handleKeyPress(event) {
    event.preventDefault();

    if (moves[event.keyCode]) {
      // Get new state of gate
      let gate = moves[event.keyCode](this.board);

      if (event.keyCode === KEY.SPACE) {
        // Hard drop
        while (this.board.isValidPosition(gate)) {
          this.board.block.move(gate);
          this.account.score += POINTS.HARD_DROP;
          gate = moves[KEY.SPACE](this.board);
        }
      }

      if (this.board.isValidPosition(gate)) {
        this.board.block.move(gate);
        if (event.keyCode === KEY.DOWN) {
          this.account.score += POINTS.SOFT_DROP;
        }
      }
    }
  }

  _updateAccount(key, value) {
    let element = document.getElementById(key);
    if (element) {
      element.textContent = value;
    }
  }

  _resetGame() {
    this.account.score = 0;
    this.account.gates = 0;
    this.account.level = 0;
    this.board = new Board(this.ctx, this.ctxNext);
    this.time = {
      startBlockDrop: performance.now(),
      elapsedBlockDrop: 0,
      startGateReduction: performance.now(),
      elapsedReduction: 0,
      startGateDrop: performance.now(),
      elapsedGateDrop: 0,
      level: LEVEL[0],
    };
  }

  _animateBlockDrop(now = 0) {
    // Update elapsed time.
    this.time.elapsedBlockDrop = now - this.time.startBlockDrop;

    if (!this.reducingGates && !this.droppingGates) {
      // If elapsed time has passed time for current level
      if (this.time.elapsedBlockDrop > this.time.level) {
        // Restart counting from now
        this.time.startBlockDrop = now;

        const result = this.board.drop(this.account, this.time);
        if (result.gameOver) {
          this._gameOver();
          return;
        }

        if (result.freeze) {
          this.time.startGateReduction = now;
          this._animateGateReduction(now);
        }
      }

      this._draw();
    }

    this.requestBlockDropAnimationId = requestAnimationFrame(
      this._animateBlockDrop.bind(this)
    );
  }

  _animateGateReduction(now = 0) {
    this.reducingGates = true;

    let reducedGates = 0;

    // Update elapsed time.
    this.time.elapsedReduction = now - this.time.startGateReduction;

    // If elapsed time > 100ms
    if (this.time.elapsedReduction > 100 && !this.droppingGates) {
      // Restart counting from now
      this.time.startGateReduction = now;

      reducedGates = this.board.reduceGates(this.account, this.time);

      if (reducedGates > 0) {
        this.board.draw();
        this.time.startGateDrop = now;
        this._animateGateDrop(now);
      }

      if (reducedGates === 0) {
        this.reducingGates = false;
        this.board._setCurrentBlock();
        this._draw();
        return;
      }
    }

    this.requestBlockDropAnimationId = requestAnimationFrame(
      this._animateGateReduction.bind(this)
    );
  }

  _animateGateDrop(now = 0) {
    this.droppingGates = true;

    let droppedGates = 0;

    // Update elapsed time.
    this.time.elapsedGateDrop = now - this.time.startGateDrop;

    // If elapsed time > 100ms
    if (this.time.elapsedGateDrop > 100) {
      // Restart counting from now
      this.time.startGateDrop = now;

      droppedGates = this.board.dropUnconnectedGates();
      this.board.draw();

      if (droppedGates === 0) {
        this.droppingGates = false;
        return;
      }
    }

    this.requestGateDropAnimationId = requestAnimationFrame(
      this._animateGateDrop.bind(this)
    );
  }

  _gameOver() {
    cancelAnimationFrame(this.requestBlockDropAnimationId);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(1, 3, 8, 1.2);
    this.ctx.font = "1px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.fillText("GAME OVER", 1.8, 4);

    this._checkHighScore(this.account.score);
  }

  _draw() {
    this.board.draw();
    this.board.block.draw(this.ctx);
  }

  showHighScores() {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
    const highScoreList = document.getElementById(HIGH_SCORES);

    highScoreList.innerHTML = highScores
      .map((score) => `<li>${score.score} - ${score.name}</li>`)
      .join("");
  }

  _checkHighScore(score) {
    const highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) || [];
    const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

    if (score > lowestScore) {
      this._saveHighScore(score, highScores);
      this.showHighScores();
    }
  }

  _saveHighScore(score, highScores) {
    const name = prompt("You got a highscore! Enter name:");
    const newScore = { score, name };

    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(NO_OF_HIGH_SCORES);

    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));
  }
}
