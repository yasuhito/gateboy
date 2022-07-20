import { Block } from "../src/block.js";
import { Board } from "../src/board.js";

describe("Block", () => {
  describe("random", () => {
    it("should return a random block", function () {
      const block = Block.random();

      expect(block).toBeInstanceOf(Block);
    });
  });

  describe("new", () => {
    it("should have name", function () {
      const block = new Block("H");

      expect(block.name).toEqual("H");
    });

    it("should throw an exception when an invalid name is passed", function () {
      expect(() => {
        new Block("?");
      }).toThrow("Invalid block name: ?");
    });

    it("should have its own unique shape", function () {
      const hBlock = new Block("H");
      const xBlock = new Block("X");
      const yBlock = new Block("Y");
      const zBlock = new Block("Z");
      const sBlock = new Block("S");
      const tBlock = new Block("T");

      expect(hBlock.shape).toEqual([
        ["I", "I", "I", "I"],
        ["H", "H", "H", "H"],
        ["I", "I", "I", "I"],
        ["I", "I", "I", "I"],
      ]);
      expect(xBlock.shape).toEqual([
        ["X", "I", "I"],
        ["X", "X", "X"],
        ["I", "I", "I"],
      ]);
      expect(yBlock.shape).toEqual([
        ["I", "I", "Y"],
        ["Y", "Y", "Y"],
        ["I", "I", "I"],
      ]);
      expect(zBlock.shape).toEqual([
        ["Z", "Z"],
        ["Z", "Z"],
      ]);
      expect(sBlock.shape).toEqual([
        ["I", "S", "S"],
        ["S", "S", "I"],
        ["I", "I", "I"],
      ]);
      expect(tBlock.shape).toEqual([
        ["I", "T", "I"],
        ["T", "T", "T"],
        ["I", "I", "I"],
      ]);
    });

    it("should have its own unique color", function () {
      const hBlock = new Block("H");
      const xBlock = new Block("X");
      const yBlock = new Block("Y");
      const zBlock = new Block("Z");
      const sBlock = new Block("S");
      const tBlock = new Block("T");

      expect(hBlock.color).toEqual("cyan");
      expect(xBlock.color).toEqual("blue");
      expect(yBlock.color).toEqual("orange");
      expect(zBlock.color).toEqual("green");
      expect(sBlock.color).toEqual("purple");
      expect(tBlock.color).toEqual("red");
    });

    it("should initialize x and y with 0", function () {
      const block = new Block("H");

      expect(block.x).toBe(0);
      expect(block.y).toBe(0);
    });
  });

  describe("draw", () => {
    beforeEach(function () {
      const board = document.createElement("canvas");
      board.id = "board";
      document.body.appendChild(board);
    });

    it("H block should draw its own shape", function () {
      const block = new Block("H");
      const ctx = Board.createBoardCanvasContext();

      block.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });

    it("X block should draw its own shape", function () {
      const block = new Block("X");
      const ctx = Board.createBoardCanvasContext();

      block.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });

    it("Y block should draw its own shape", function () {
      const block = new Block("Y");
      const ctx = Board.createBoardCanvasContext();

      block.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });

    it("Z block should draw its own shape", function () {
      const block = new Block("Z");
      const ctx = Board.createBoardCanvasContext();

      block.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });

    it("S block should draw its own shape", function () {
      const block = new Block("S");
      const ctx = Board.createBoardCanvasContext();

      block.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });

    it("T block should draw its own shape", function () {
      const block = new Block("T");
      const ctx = Board.createBoardCanvasContext();

      block.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });
  });

  describe("move", () => {
    it("should update its x, y and shape", function () {
      const block = new Block("H");
      const moveBlock = new Block("H");
      moveBlock.x = 2;
      moveBlock.y = 3;
      moveBlock.shape = [
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
      ];

      block.move(moveBlock);

      expect(block.x).toEqual(2);
      expect(block.y).toEqual(3);
      expect(block.shape).toEqual([
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
      ]);
    });
  });
});
