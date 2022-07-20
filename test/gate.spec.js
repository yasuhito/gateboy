import { Gate } from "../src/gate.js";
import { Board } from "../src/board.js";

describe("Gate", () => {
  describe("random", () => {
    it("should return a random gate", function () {
      const gate = Gate.random();

      expect(gate).toBeInstanceOf(Gate);
    });
  });

  describe("new", () => {
    it("should have name", function () {
      const gate = new Gate("H");

      expect(gate.name).toEqual("H");
    });

    it("should throw an exception when an invalid name is passed", function () {
      expect(() => {
        new Gate("?");
      }).toThrow("Invalid gate name: ?");
    });

    it("should have its own unique shape", function () {
      const hGate = new Gate("H");
      const xGate = new Gate("X");
      const yGate = new Gate("Y");
      const zGate = new Gate("Z");
      const sGate = new Gate("S");
      const tGate = new Gate("T");

      expect(hGate.shape).toEqual([
        ["I", "I", "I", "I"],
        ["H", "H", "H", "H"],
        ["I", "I", "I", "I"],
        ["I", "I", "I", "I"],
      ]);
      expect(xGate.shape).toEqual([
        ["X", "I", "I"],
        ["X", "X", "X"],
        ["I", "I", "I"],
      ]);
      expect(yGate.shape).toEqual([
        ["I", "I", "Y"],
        ["Y", "Y", "Y"],
        ["I", "I", "I"],
      ]);
      expect(zGate.shape).toEqual([
        ["Z", "Z"],
        ["Z", "Z"],
      ]);
      expect(sGate.shape).toEqual([
        ["I", "S", "S"],
        ["S", "S", "I"],
        ["I", "I", "I"],
      ]);
      expect(tGate.shape).toEqual([
        ["I", "T", "I"],
        ["T", "T", "T"],
        ["I", "I", "I"],
      ]);
    });

    it("should have its own unique color", function () {
      const hGate = new Gate("H");
      const xGate = new Gate("X");
      const yGate = new Gate("Y");
      const zGate = new Gate("Z");
      const sGate = new Gate("S");
      const tGate = new Gate("T");

      expect(hGate.color).toEqual("cyan");
      expect(xGate.color).toEqual("blue");
      expect(yGate.color).toEqual("orange");
      expect(zGate.color).toEqual("green");
      expect(sGate.color).toEqual("purple");
      expect(tGate.color).toEqual("red");
    });

    it("should initialize x and y with 0", function () {
      const gate = new Gate("H");

      expect(gate.x).toBe(0);
      expect(gate.y).toBe(0);
    });
  });

  describe("draw", () => {
    beforeEach(function () {
      const board = document.createElement("canvas");
      board.id = "board";
      document.body.appendChild(board);
    });

    it("H gate should draw its own shape", function () {
      const gate = new Gate("H");
      const ctx = Board.createBoardCanvasContext();

      gate.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });

    it("X gate should draw its own shape", function () {
      const gate = new Gate("X");
      const ctx = Board.createBoardCanvasContext();

      gate.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });

    it("Y gate should draw its own shape", function () {
      const gate = new Gate("Y");
      const ctx = Board.createBoardCanvasContext();

      gate.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });

    it("Z gate should draw its own shape", function () {
      const gate = new Gate("Z");
      const ctx = Board.createBoardCanvasContext();

      gate.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });

    it("S gate should draw its own shape", function () {
      const gate = new Gate("S");
      const ctx = Board.createBoardCanvasContext();

      gate.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });

    it("T gate should draw its own shape", function () {
      const gate = new Gate("T");
      const ctx = Board.createBoardCanvasContext();

      gate.draw(ctx);
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    });
  });

  describe("move", () => {
    it("should update its x, y and shape", function () {
      const gate = new Gate("H");
      const moveGate = new Gate("H");
      moveGate.x = 2;
      moveGate.y = 3;
      moveGate.shape = [
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
      ];

      gate.move(moveGate);

      expect(gate.x).toEqual(2);
      expect(gate.y).toEqual(3);
      expect(gate.shape).toEqual([
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
        ["I", "H", "I", "I"],
      ]);
    });
  });
});
