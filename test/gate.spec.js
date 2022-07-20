import {Gate} from '../src/gate.js';
import {getBoardCanvasContext} from '../src/constants.js';

describe('new Gate', () => {
  beforeEach(function() {
    const board = document.createElement('canvas');
    board.id = 'board'
    document.body.appendChild(board);
  });

  it('should have random name', function () {
    const context = getBoardCanvasContext();
    const gate = new Gate(context);

    expect(Gate.NAMES.includes(gate.name)).toBe(true);
  })

  it('should have random shape', function () {
    const context = getBoardCanvasContext();
    const gate = new Gate(context);

    expect(Gate.SHAPES.includes(gate.shape)).toBe(true);
  })

  it('should initialize x and y with 0', function () {
    const context = getBoardCanvasContext();
    const gate = new Gate(context);

    expect(gate.x).toBe(0)
    expect(gate.y).toBe(0)
  })
})
