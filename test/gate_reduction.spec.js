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

  //  H
  // HHH
  // ↓
  // H H
  it("should reduce HH to I", function () {
    board.block = new Block("H");
    hardDrop(board);

    board.reduceGates(account);

    for (let i = 0; i <= 18; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    expect(board.grid[19]).toStrictEqual(["H","I","H","I","I","I","I","I","I","I"]);
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

  //  ZZ
  // ZZ
  //  ↓
  // Z Z
  it("should reduce ZZ to I", function () {
    board.block = new Block("Z");
    hardDrop(board);

    board.reduceGates(account);
    board.dropUnconnectedGates();

    for (let i = 0; i <= 18; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    expect(board.grid[19]).toStrictEqual(["Z","I","Z","I","I","I","I","I","I","I"]);
  });

  // SS
  // SS
  //  ↓
  // ZZ
  it("should reduce SS to Z", function () {
    board.block = new Block("S");
    hardDrop(board);

    board.reduceGates(account);

    for (let i = 0; i <= 18; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["Z","Z","I","I","I","I","I","I","I","I"]);
  });

  //  T
  // TTT
  //  ↓
  // TST
  it("should reduce TT to S", function () {
    board.block = new Block("T");
    const rotatedBlock = board.rotate(board.block);
    board.block.move(rotatedBlock);
    hardDrop(board);

    board.reduceGates(account);

    for (let i = 0; i <= 16; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[17]).toStrictEqual(["I","I","S","I","I","I","I","I","I","I"]);
    // prettier-ignore
    expect(board.grid[18]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["I","I","S","I","I","I","I","I","I","I"]);
  });

  //  ZZ
  // ZZ
  //  XX
  //  ↓
  //  Z
  // ZYY
  it("should reduce XZ to Y", function () {
    board.block = new Block("X");
    hardDrop(board);
    board.reduceGates(account);

    board.block = new Block("Z");
    hardDrop(board);

    board.reduceGates(account);
    board.dropUnconnectedGates();
    board.reduceGates(account);

    for (let i = 0; i <= 17; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[18]).toStrictEqual(["I","Z","I","I","I","I","I","I","I","I"]);
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["Z","Y","Y","I","I","I","I","I","I","I"]);
  });

  // X
  // XXX  
  // Z Z
  // ↓
  // X
  // YXY
  it("should reduce ZX to Y", function () {
    board.block = new Block("Z");
    hardDrop(board);
    board.reduceGates(account);
    board.dropUnconnectedGates();

    board.block = new Block("X");
    hardDrop(board);

    board.reduceGates(account);
    board.dropUnconnectedGates();
    board.reduceGates(account);

    for (let i = 0; i <= 17; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    expect(board.grid[18]).toStrictEqual(["X","I","I","I","I","I","I","I","I","I"]);
    expect(board.grid[19]).toStrictEqual(["Y","X","Y","I","I","I","I","I","I","I"]);
  });

  //  H
  // HHH
  //  XX
  // H H
  //  ↓
  //  XZ
  it("should reduce HXH to Y", function () {
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
    board.dropUnconnectedGates();
    board.reduceGates(account);
    
    for (let i = 0; i < 19; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["I","X","Z","I","I","I","I","I","I","I"]);
  });

  // SSSS
  // Z Z
  // SSSS
  //  ↓
  // ZZZZ
  it("should reduce SZS to Z", function () {
    board.block = new Block("T");
    hardDrop(board);
    board.block = new Block("T");
    hardDrop(board);
    board.reduceGates(account);

    board.block = new Block("Z");
    hardDrop(board);
    board.reduceGates(account);
    board.dropUnconnectedGates();

    board.block = new Block("T");
    hardDrop(board);
    board.block = new Block("T");
    hardDrop(board);
    board.reduceGates(account);

    board.reduceGates(account);
    board.dropUnconnectedGates();
    board.reduceGates(account);

    for (let i = 0; i <= 18; i++) {
      // prettier-ignore
      expect(board.grid[i]).toStrictEqual(["I","I","I","I","I","I","I","I","I","I"]);
    }
    // prettier-ignore
    expect(board.grid[19]).toStrictEqual(["Z","Z","Z","Z","I","I","I","I","I","I"]);
  });
  
  function hardDrop(board) {
    let freeze = false;

    while (!freeze) {
      freeze = board.drop().freeze;
    }
  }
});
