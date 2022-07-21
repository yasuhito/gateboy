import { Block } from "../src/block.js";
import { Board } from "../src/board.js";

describe("gate reduction rules", () => {
  let board = null;
  let account = null;

  beforeEach(function () {
    const boardCanvas = document.createElement("canvas");
    const nextCanvas = document.createElement("canvas");
    boardCanvas.id = "board";
    nextCanvas.id = "next";
    document.body.appendChild(boardCanvas);
    document.body.appendChild(nextCanvas);

    const ctx = Board.createBoardCanvasContext();
    const ctxNext = Board.createNextCanvasContext();
    board = new Board(ctx, ctxNext);
    account = { score: 0, gates: 0, level: 0 };
  });

  // H
  // H
  // H
  // H
  // ↓
  // I
  it("should reduce HH to I", function () {
    board.block = new Block("H");
    const rotatedBlock = board.rotate(board.block);
    board.block.move(rotatedBlock);
    hardDrop(board);

    board.reduceGates(account);

    for (let i = 0; i <= 19; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
  });

  // X
  // XXX
  //  ↓
  //  XX
  it("should reduce XX to I", function () {
    board.block = new Block("X");
    hardDrop(board);

    board.reduceGates(account);

    for (let i = 0; i < 19; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["I","X","X","I","I","I","I","I","I","I"]);
  });

  //   Y
  // YYY
  //  ↓
  // YY
  it("should reduce YY to I", function () {
    board.block = new Block("Y");
    hardDrop(board);

    board.reduceGates(account);

    for (let i = 0; i < 19; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["Y","Y","I","I","I","I","I","I","I","I"]);
  });

  // ZZ
  // ZZ
  //  ↓
  //
  it("should reduce ZZ to I", function () {
    board.block = new Block("Z");
    hardDrop(board);

    board.reduceGates(account);

    for (let i = 0; i <= 19; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
  });

  //  SS
  // SS
  //  ↓
  // SZS
  it("should reduce SS to Z", function () {
    board.block = new Block("S");
    hardDrop(board);

    board.reduceGates(account);
    board.dropUnconnectedGates();

    for (let i = 0; i < 19; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["S","Z","S","I","I","I","I","I","I","I"]);
  });

  //  T
  // TTT
  //  ↓
  // TST
  it("should reduce TT to S", function () {
    board.block = new Block("T");
    hardDrop(board);

    board.reduceGates(account);

    for (let i = 0; i < 19; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["T","S","T","I","I","I","I","I","I","I"]);
  });

  // ZZ
  // ZZ
  //  XX
  //  ↓
  //  Z
  //  YX
  it("should reduce XZ to Y", function () {
    board.block = new Block("X");
    hardDrop(board);
    board.reduceGates(account);

    board.block = new Block("Z");
    hardDrop(board);

    board.reduceGates(account);
    board.dropUnconnectedGates();

    for (let i = 0; i <= 17; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[18]).toStrictEqual(["I","Z","I","I","I","I","I","I","I","I"]);
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["I","Y","X","I","I","I","I","I","I","I"]);
  });

  // X
  // XXX
  //  Z
  //  YX
  //  ↓
  //  Y
  //  Y
  //  ↓
  //  I
  it("should reduce XZ to Y", function () {
    board.block = new Block("X");
    hardDrop(board);
    board.reduceGates(account);

    board.block = new Block("Z");
    hardDrop(board);
    board.reduceGates(account);
    board.dropUnconnectedGates();

    board.block = new Block("X");
    hardDrop(board);

    board.reduceGates(account);
    board.dropUnconnectedGates();
    board.reduceGates(account);

    for (let i = 0; i <= 19; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
  });

  //
  // HHHH
  //  XX
  // HHHH
  //  ↓
  //  ZZ
  it("should reduce XZ to Y", function () {
    board.block = new Block("H");
    hardDrop(board);

    board.block = new Block("X");
    hardDrop(board);
    board.reduceGates(account);

    board.block = new Block("H");
    hardDrop(board);

    board.reduceGates(account);
    board.dropUnconnectedGates();
    board.reduceGates(account);

    for (let i = 0; i < 19; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["I","Z","Z","I","I","I","I","I","I","I"]);
  });

  function hardDrop(board) {
    let freeze = false;

    while (!freeze) {
      freeze = board.drop().freeze;
    }
  }
});
