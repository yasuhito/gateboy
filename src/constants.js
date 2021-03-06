export const I = "I";
export const H = "H";
export const X = "X";
export const Y = "Y";
export const Z = "Z";
export const S = "S";
export const T = "T";

export const NO_OF_HIGH_SCORES = 10;
export const HIGH_SCORES = "highScores";

export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};
Object.freeze(POINTS);

export const GATES_PER_LEVEL = 40;
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
};
Object.freeze(LEVEL);

export const KEY = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};
Object.freeze(KEY);

export const moves = {
  [KEY.LEFT]: (board) => ({ ...board.block, x: board.block.x - 1 }),
  [KEY.RIGHT]: (board) => ({ ...board.block, x: board.block.x + 1 }),
  [KEY.DOWN]: (board) => ({ ...board.block, y: board.block.y + 1 }),
  [KEY.UP]: (board) => board.rotate(board.block),
  [KEY.SPACE]: (board) => ({ ...board.block, y: board.block.y + 1 }),
};
