export const pieces = [
  {
    name: 'king',
    startingCell: {
      white: ['e1'],
      black: ['e8'],
    },
  },
  {
    name: 'queen',
    startingCell: {
      white: ['d1'],
      black: ['d8'],
    },
  },
  {
    name: 'bishop',
    startingCell: {
      white: ['c1', 'f1'],
      black: ['c8', 'f8'],
    },
  },
  {
    name: 'knight',
    startingCell: {
      white: ['b1', 'g1'],
      black: ['b8', 'g8'],
    },
  },
  {
    name: 'rook',
    startingCell: {
      white: ['a1', 'h1'],
      black: ['a8', 'h8'],
    },
  },
  {
    name: 'pawn',
    startingCell: {
      white: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
      black: ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
    },
  },
];
