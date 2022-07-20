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

    it("should set the next gate", function () {
      const board = new Board(ctx, ctxNext);

      expect(board.nextBlock).toBeInstanceOf(Block);
    });

    it("should set the current gate", function () {
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

    it("should rotate H gate block", function () {
      const gate = new Block("H");
      const rotatedGate = board.rotate(gate);

      expect(rotatedGate.shape).toEqual([
        ["I", "I", "H", "I"],
        ["I", "I", "H", "I"],
        ["I", "I", "H", "I"],
        ["I", "I", "H", "I"],
      ]);
    });

    it("should rotate X gate block", function () {
      const gate = new Block("X");
      const rotatedGate = board.rotate(gate);

      expect(rotatedGate.shape).toEqual([
        ["I", "X", "X"],
        ["I", "X", "I"],
        ["I", "X", "I"],
      ]);
    });

    it("should rotate Y gate block", function () {
      const gate = new Block("Y");
      const rotatedGate = board.rotate(gate);

      expect(rotatedGate.shape).toEqual([
        ["I", "Y", "I"],
        ["I", "Y", "I"],
        ["I", "Y", "Y"],
      ]);
    });

    it("should rotate Z gate block", function () {
      const gate = new Block("Z");
      const rotatedGate = board.rotate(gate);

      expect(rotatedGate.shape).toEqual([
        ["Z", "Z"],
        ["Z", "Z"],
      ]);
    });

    it("should rotate S gate block", function () {
      const gate = new Block("S");
      const rotatedGate = board.rotate(gate);

      expect(rotatedGate.shape).toEqual([
        ["I", "S", "I"],
        ["I", "S", "S"],
        ["I", "I", "S"],
      ]);
    });

    it("should rotate T gate block", function () {
      const gate = new Block("T");
      const rotatedGate = board.rotate(gate);

      expect(rotatedGate.shape).toEqual([
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

    it("should return true if H gate block is located inside the walls", function () {
      const gate = new Block("H");

      for (const x of [1, 2, 3, 4, 5, 6]) {
        gate.x = x
        expect(board.isValidPosition(gate)).toBeTruthy()
      }
    });

    it("should return false if H gate block is located outside the left wall", function () {
      const gate = new Block("H");
      gate.x = -1

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return false if H gate block is located outside the right wall", function () {
      const gate = new Block("H");
      gate.x = 7

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return true if X gate block is located inside the walls", function () {
      const gate = new Block("X");

      for (const x of [1, 2, 3, 4, 5, 6, 7]) {
        gate.x = x
        expect(board.isValidPosition(gate)).toBeTruthy()
      }
    });

    it("should return false if X gate block is located outside the left wall", function () {
      const gate = new Block("X");
      gate.x = -1

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return false if X gate block is located outside the right wall", function () {
      const gate = new Block("X");
      gate.x = 8

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return true if Y gate block is located inside the walls", function () {
      const gate = new Block("Y");

      for (const x of [1, 2, 3, 4, 5, 6, 7]) {
        gate.x = x
        expect(board.isValidPosition(gate)).toBeTruthy()
      }
    });

    it("should return false if Y gate block is located outside the left wall", function () {
      const gate = new Block("Y");
      gate.x = -1

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return false if Y gate block is located outside the right wall", function () {
      const gate = new Block("Y");
      gate.x = 8

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return true if Z gate block is located inside the walls", function () {
      const gate = new Block("Z");

      for (const x of [1, 2, 3, 4, 5, 6, 7, 8]) {
        gate.x = x
        expect(board.isValidPosition(gate)).toBeTruthy()
      }
    });

    it("should return false if Z gate block is located outside the left wall", function () {
      const gate = new Block("Z");
      gate.x = -1

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return false if Z gate block is located outside the right wall", function () {
      const gate = new Block("Z");
      gate.x = 9

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return true if S gate block is located inside the walls", function () {
      const gate = new Block("S");

      for (const x of [1, 2, 3, 4, 5, 6, 7]) {
        gate.x = x
        expect(board.isValidPosition(gate)).toBeTruthy()
      }
    });

    it("should return false if S gate block is located outside the left wall", function () {
      const gate = new Block("S");
      gate.x = -1

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return false if S gate block is located outside the right wall", function () {
      const gate = new Block("S");
      gate.x = 8

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return true if T gate block is located inside the walls", function () {
      const gate = new Block("T");

      for (const x of [1, 2, 3, 4, 5, 6, 7]) {
        gate.x = x
        expect(board.isValidPosition(gate)).toBeTruthy()
      }
    });

    it("should return false if T gate block is located outside the left wall", function () {
      const gate = new Block("T");
      gate.x = -1

      expect(board.isValidPosition(gate)).toBeFalsy()
    });

    it("should return false if T gate block is located outside the right wall", function () {
      const gate = new Block("T");
      gate.x = 8

      expect(board.isValidPosition(gate)).toBeFalsy()
    });
  })
});
