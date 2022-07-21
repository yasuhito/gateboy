import { Block } from "../src/block.js";
import { Board } from "../src/board.js";

describe("Board", () => {
  beforeEach(function () {
    const board = document.createElement("canvas");
    const next = document.createElement("canvas");
    board.id = "board";
    next.id = "next";
    document.body.appendChild(board);
    document.body.appendChild(next);
  });

  describe("new", function () {
    let ctx = null;
    let ctxNext = null;

    beforeEach(function () {
      ctx = Board.createBoardCanvasContext();
      ctxNext = Board.createNextCanvasContext();
    });

    it("should initialize grid with I", function () {
      const board = new Board(ctx, ctxNext);

      expect(board.grid.length).toBe(Board.ROWS);
      expect(
        board.grid.every((each) => each.length === Board.COLS)
      ).toBeTruthy();
      expect(
        board.grid.every((each) => each.every((gate) => gate === "I"))
      ).toBeTruthy();
    });

    it("should set the next block", function () {
      const board = new Board(ctx, ctxNext);

      expect(board.nextBlock).toBeInstanceOf(Block);
    });

    it("should set the current block", function () {
      const board = new Board(ctx, ctxNext);

      expect(board.block).toBeInstanceOf(Block);
    });
  });

  describe("rotate", function () {
    let board = null;

    beforeEach(function () {
      const ctx = Board.createBoardCanvasContext();
      const ctxNext = Board.createNextCanvasContext();
      board = new Board(ctx, ctxNext);
    });

    it("should rotate H block", function () {
      const block = new Block("H");
      const rotatedBlock = board.rotate(block);

      expect(rotatedBlock.shape).toEqual([
        ["I", "I", "H", "I"],
        ["I", "I", "H", "I"],
        ["I", "I", "H", "I"],
        ["I", "I", "H", "I"],
      ]);
    });

    it("should rotate X block", function () {
      const block = new Block("X");
      const rotatedBlock = board.rotate(block);

      expect(rotatedBlock.shape).toEqual([
        ["I", "X", "X"],
        ["I", "X", "I"],
        ["I", "X", "I"],
      ]);
    });

    it("should rotate Y block", function () {
      const block = new Block("Y");
      const rotatedBlock = board.rotate(block);

      expect(rotatedBlock.shape).toEqual([
        ["I", "Y", "I"],
        ["I", "Y", "I"],
        ["I", "Y", "Y"],
      ]);
    });

    it("should rotate Z block", function () {
      const block = new Block("Z");
      const rotatedBlock = board.rotate(block);

      expect(rotatedBlock.shape).toEqual([
        ["Z", "Z"],
        ["Z", "Z"],
      ]);
    });

    it("should rotate S block", function () {
      const block = new Block("S");
      const rotatedBlock = board.rotate(block);

      expect(rotatedBlock.shape).toEqual([
        ["I", "S", "I"],
        ["I", "S", "S"],
        ["I", "I", "S"],
      ]);
    });

    it("should rotate T block", function () {
      const block = new Block("T");
      const rotatedBlock = board.rotate(block);

      expect(rotatedBlock.shape).toEqual([
        ["I", "T", "I"],
        ["I", "T", "T"],
        ["I", "T", "I"],
      ]);
    });
  });

  describe("isValidPosition", function () {
    let board = null;

    beforeEach(function () {
      const ctx = Board.createBoardCanvasContext();
      const ctxNext = Board.createNextCanvasContext();
      board = new Board(ctx, ctxNext);
    });

    it("should return true if H block is located inside the walls", function () {
      const block = new Block("H");

      for (const x of [1, 2, 3, 4, 5, 6]) {
        block.x = x;
        expect(board.isValidPosition(block)).toBeTruthy();
      }
    });

    it("should return false if H block is located outside the left wall", function () {
      const block = new Block("H");
      block.x = -1;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return false if H block is located outside the right wall", function () {
      const block = new Block("H");
      block.x = 7;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return true if X block is located inside the walls", function () {
      const block = new Block("X");

      for (const x of [1, 2, 3, 4, 5, 6, 7]) {
        block.x = x;
        expect(board.isValidPosition(block)).toBeTruthy();
      }
    });

    it("should return false if X block is located outside the left wall", function () {
      const block = new Block("X");
      block.x = -1;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return false if X block is located outside the right wall", function () {
      const block = new Block("X");
      block.x = 8;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return true if Y block is located inside the walls", function () {
      const block = new Block("Y");

      for (const x of [1, 2, 3, 4, 5, 6, 7]) {
        block.x = x;
        expect(board.isValidPosition(block)).toBeTruthy();
      }
    });

    it("should return false if Y block is located outside the left wall", function () {
      const block = new Block("Y");
      block.x = -1;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return false if Y block is located outside the right wall", function () {
      const block = new Block("Y");
      block.x = 8;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return true if Z block is located inside the walls", function () {
      const block = new Block("Z");

      for (const x of [1, 2, 3, 4, 5, 6, 7, 8]) {
        block.x = x;
        expect(board.isValidPosition(block)).toBeTruthy();
      }
    });

    it("should return false if Z block is located outside the left wall", function () {
      const block = new Block("Z");
      block.x = -1;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return false if Z block is located outside the right wall", function () {
      const block = new Block("Z");
      block.x = 9;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return true if S block is located inside the walls", function () {
      const block = new Block("S");

      for (const x of [1, 2, 3, 4, 5, 6, 7]) {
        block.x = x;
        expect(board.isValidPosition(block)).toBeTruthy();
      }
    });

    it("should return false if S block is located outside the left wall", function () {
      const block = new Block("S");
      block.x = -1;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return false if S block is located outside the right wall", function () {
      const block = new Block("S");
      block.x = 8;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return true if T block is located inside the walls", function () {
      const block = new Block("T");

      for (const x of [1, 2, 3, 4, 5, 6, 7]) {
        block.x = x;
        expect(board.isValidPosition(block)).toBeTruthy();
      }
    });

    it("should return false if T block is located outside the left wall", function () {
      const block = new Block("T");
      block.x = -1;

      expect(board.isValidPosition(block)).toBeFalsy();
    });

    it("should return false if T block is located outside the right wall", function () {
      const block = new Block("T");
      block.x = 8;

      expect(board.isValidPosition(block)).toBeFalsy();
    });
  });

  describe("drop", () => {
    let board = null;
    let account = null;

    beforeEach(function () {
      const ctx = Board.createBoardCanvasContext();
      const ctxNext = Board.createNextCanvasContext();
      board = new Board(ctx, ctxNext);
      account = { score: 0, gates: 0, level: 0 }
    });

    it("should move down its block", function () {
      board.drop()

      expect(board.block.y).toBe(1)
    })

    it("should return { gameOver: false } if not game over", function () {
      expect(board.drop().gameOver).toBeFalsy()
    })

    // HHHH
    //  ↓
    // HHHH
    it("should freeze when H-block reaches the bottom", function () {
      board.block = new Block("H")

      for (let i = 0; i < 20; i++) board.drop(account)

      for (let i = 0; i < 19; i++) {
        expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"])
      }
      expect(board.grid[19]).toStrictEqual(["H","H","H","H","I","I","I","I","I","I"])
    })

    // X
    // XXX
    //  ↓
    //  XX
    it("should freeze and reduce gates when X-block reaches the bottom", function () {
      board.block = new Block("X")

      for (let i = 0; i < 20; i++) board.drop(account)

      for (let i = 0; i < 19; i++) {
        expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"])
      }
      expect(board.grid[19]).toStrictEqual(["I","X","X","I","I","I","I","I","I","I"])
    })

    //   Y
    // YYY
    //  ↓
    // YY
    it("should freeze and reduce gates when Y-block reaches the bottom", function () {
      board.block = new Block("Y")

      for (let i = 0; i < 20; i++) board.drop(account)

      for (let i = 0; i < 19; i++) {
        expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"])
      }
      expect(board.grid[19]).toStrictEqual(["Y","Y","I","I","I","I","I","I","I","I"])
    })

    // ZZ
    // ZZ
    //  ↓
    //
    it("should freeze and reduce gates when Z-block reaches the bottom", function () {
      board.block = new Block("Z")

      for (let i = 0; i < 20; i++) board.drop(account)

      for (let i = 0; i < 19; i++) {
        expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"])
      }
      expect(board.grid[19]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"])
    })

    //  SS
    // SS
    //  ↓
    // SZS
    it("should freeze and reduce gates when S-block reaches the bottom", function () {
      board.block = new Block("S")

      for (let i = 0; i < 20; i++) board.drop(account)

      for (let i = 0; i < 19; i++) {
        expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"])
      }
      expect(board.grid[19]).toStrictEqual(["S","Z","S","I","I","I","I","I","I","I"])
    })

    //  T
    // TTT
    //  ↓
    // TST
    it("should freeze and reduce gates when T-block reaches the bottom", function () {
      board.block = new Block("T")

      for (let i = 0; i < 20; i++) board.drop(account)

      for (let i = 0; i < 19; i++) {
        expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"])
      }
      expect(board.grid[19]).toStrictEqual(["T","S","T","I","I","I","I","I","I","I"])
    })
  })
});
