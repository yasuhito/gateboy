export const COLS = 10;
export const ROWS = 20;
const BLOCK_SIZE = 30;
export const NO_OF_HIGH_SCORES = 10;
export const HIGH_SCORES = 'highScores';
export const NAMES = ['H', 'X', 'Y', 'Z', 'S', 'T']
export const COLORS = ['cyan', 'blue', 'orange', 'green', 'purple', 'red'];

// const SHAPES = [
//   [['H']],
//   [['X']],
//   [['Y']],
//   [['Z']],
//   [['S']],
//   [['T']]
// ];

export const SHAPES = [
  [['I', 'I', 'I', 'I'], ['H', 'H', 'H', 'H'], ['I', 'I', 'I', 'I'], ['I', 'I', 'I', 'I']],
  [['X', 'I', 'I'], ['X', 'X', 'X'], ['I', 'I', 'I']],
  [['I', 'I', 'Y'], ['Y', 'Y', 'Y'], ['I', 'I', 'I']],
  [['Z', 'Z'], ['Z', 'Z']],
  [['I', 'S', 'S'], ['S', 'S', 'I'], ['I', 'I', 'I']],
  [['I', 'T', 'I'], ['T', 'T', 'T'], ['I', 'I', 'I']],
  // [[7, 7, 'I'], ['I', 7, 7], ['I', 'I', 'I']]
];

export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2
}
Object.freeze(POINTS);

export const GATES_PER_LEVEL = 10;
export const LEVEL = {
  0: 800,
  1: 720,
  2: 630,
  3: 550,
  4: 470,
  5: 380,
  6: 300,
  7: 220,
  8: 130,
  9: 100,
  10: 80,
  11: 80,
  12: 80,
  13: 70,
  14: 70,
  15: 70,
  16: 50,
  17: 50,
  18: 50,
  19: 30,
  20: 30,
  // 29+ is 20ms
}
Object.freeze(LEVEL);

const canvas = document.getElementById('board');
export const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
export const ctxNext = canvasNext.getContext('2d');

// Calculate size of canvas from constants.
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// Size canvas for four blocks.
ctxNext.canvas.width = 4 * BLOCK_SIZE;
ctxNext.canvas.height = 4 * BLOCK_SIZE;

// Scale blocks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);


export const KEY = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
}
Object.freeze(KEY);

export const moves = {
  [KEY.LEFT]:  (board) => ({ ...board.gate, x: board.gate.x - 1 }),
  [KEY.RIGHT]: (board) => ({ ...board.gate, x: board.gate.x + 1 }),
  [KEY.DOWN]:  (board) => ({ ...board.gate, y: board.gate.y + 1 }),
  [KEY.UP]:    (board) => board.rotate(board.gate),
  [KEY.SPACE]:  (board) => ({ ...board.gate, y: board.gate.y + 1 }),
};