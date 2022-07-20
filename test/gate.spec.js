import {Gate} from '../src/gate.js';
import {getBoardCanvasContext} from '../src/constants.js';

describe('Gate', () => {
  describe('new', () => {
    it('should have name', function () {
      const gate = new Gate('H');

      expect(gate.name).toEqual('H');
    })

    it('should have its own unique shape', function () {
      const gate = new Gate('H');

      expect(gate.shape).toEqual([
        ['I', 'I', 'I', 'I'],
        ['H', 'H', 'H', 'H'],
        ['I', 'I', 'I', 'I'],
        ['I', 'I', 'I', 'I']
      ]);
    })

    it('should have its own unique color', function () {
      const gate = new Gate('H');

      expect(gate.color).toEqual('cyan');
    })

    it('should initialize x and y with 0', function () {
      const gate = new Gate('H');

      expect(gate.x).toBe(0)
      expect(gate.y).toBe(0)
    })
  })

  describe('draw', () => {
    beforeEach(function() {
      const board = document.createElement('canvas');
      board.id = 'board'
      document.body.appendChild(board);
    });

    it('should draw its own shape', function () {
      const gate = new Gate('H');
      const ctx = getBoardCanvasContext();

      gate.draw(ctx)
      const events = ctx.__getEvents();

      expect(events).toMatchSnapshot();
    })
  })
})
