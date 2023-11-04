import { pieces } from './data/pieces.js';

const board = document.getElementById('board');
const columnIndex = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// some variables for moving
let isPieceActive = false;
let currentTurn = 1;
let activePieceId;
function activeSide() {
  if (currentTurn % 2 === 0) {
    return 'black';
  } else {
    return 'white';
  }
}

class ChessPiece {
  name;
  color;
  id;
  isFirstMove;
  constructor(name, color, id, isFirstMove) {
    this.name = name;
    this.color = color;
    this.id = id;
    this.isFirstMove = isFirstMove;
  }
}
class Pawn extends ChessPiece {
  move() {
    const availableSquares = [];
    const canTakePieceSquares = [];

    const altBoard = [];
    fillAltBoard(altBoard);

    const squareId = document.getElementById(this.id).parentElement.id;
    const pawnPosition = {
      column: columnIndex.indexOf(squareId[0]),
      row: +squareId[1] - 1,
    };

    // if pawn's color = white, then it move only up (+1 to previous Y); if color = black => pawn move anly down (previous Y - 1)
    const directionOfMove = this.color === 'white' ? 1 : -1;
    // check corners for enemy pieces
    for (let corner = -1; corner <= 1; corner++) {
      if (corner === 0) {
        continue;
      }
      if (altBoard[pawnPosition.column + corner]) {
        const checkedSquare = altBoard[pawnPosition.column + corner][pawnPosition.row + directionOfMove];
        if (checkedSquare && checkedSquare[0] && checkedSquare[0].color !== this.color) {
          const squareColumn = columnIndex[pawnPosition.column + corner];
          const squareRow = pawnPosition.row + directionOfMove + 1;
          canTakePieceSquares.push(`${squareColumn}${squareRow}`);
        }
      }
    }

    // check free squares to default move
    const checkedSquare = altBoard[pawnPosition.column][pawnPosition.row + directionOfMove];
    if (checkedSquare && !checkedSquare[0]) {
      availableSquares.push(`${columnIndex[pawnPosition.column]}${pawnPosition.row + directionOfMove + 1}`);
      // also check second square if it's first pawn's move
      if (this.isFirstMove) {
        const secondCheckedSquare = altBoard[pawnPosition.column][pawnPosition.row + directionOfMove * 2];
        if (!secondCheckedSquare[0]) {
          availableSquares.push(`${columnIndex[pawnPosition.column]}${pawnPosition.row + directionOfMove * 2 + 1}`);
        }
      }
    }

    return {
      availableSquares,
      canTakePieceSquares,
    };
  }
}
class Rook extends ChessPiece {
  move() {}
}
class Bishop extends ChessPiece {
  move() {}
}
class Knight extends ChessPiece {
  move() {}
}
class Queen extends ChessPiece {
  move() {}
}
class King extends ChessPiece {
  move() {}
}

// function which fills alt board
function fillAltBoard(altBoard) {
  for (let i = 0; i < 8; i++) {
    altBoard.push([]);
    for (let j = 0; j < 8; j++) {
      altBoard[i].push([]);
    }
  }

  document.querySelectorAll('.piece').forEach((piece) => {
    const column = columnIndex.indexOf(piece.parentElement.id[0]);
    const row = +piece.parentElement.id[1] - 1;

    const pieceName = piece.getAttribute('name');
    const pieceColor = piece.dataset.color;
    const pieceId = piece.id;
    const pieceIsFirstMove = piece.dataset.isFirstMove || false;

    altBoard[column][row].push(createPiece(pieceName, pieceColor, pieceId, pieceIsFirstMove));
  });
}

// management all marks for squares
const marks = {
  addMark(pieceObj) {
    function replacePiece(square) {
      // we can't take kings so we check if this cell has king or not
      if (square.contains(square.querySelector('.piece')) && square.querySelector('.piece').getAttribute('name') === 'king') {
        return;
      }

      const pieceElementClone = document.getElementById(pieceObj.id).cloneNode(true);
      pieceElementClone.removeAttribute('data-is-first-move');
      // remove piece from start position
      document.getElementById(pieceObj.id).remove();
      // clear inner html of selected square and add piece to it new position
      square.innerHTML = '';
      square.appendChild(pieceElementClone);

      document.getElementById(pieceObj.id).addEventListener('click', () => {
        const chessPiece = createPiece(pieceObj.name, pieceObj.color, pieceObj.id, false);
        pieceFun(chessPiece);
      });
    }

    pieceObj.move().availableSquares.forEach((square) => {
      const squareMarkElement = document.createElement('div');
      squareMarkElement.className = 'square__available';
      document.getElementById(square).appendChild(squareMarkElement);

      squareMarkElement.addEventListener('click', () => {
        replacePiece(document.getElementById(square));
        this.removeMark();
        currentTurn++;
      });
    });

    pieceObj.move().canTakePieceSquares.forEach((square) => {
      const squareMarkElement = document.createElement('div');
      squareMarkElement.className = 'square__can-take';
      document.getElementById(square).appendChild(squareMarkElement);

      squareMarkElement.parentElement.addEventListener('click', () => {
        replacePiece(document.getElementById(square));
        this.removeMark();
        currentTurn++;
      });
    });
  },
  removeMark() {
    document.querySelectorAll('.square__available').forEach((square) => {
      square.remove();
    });
    document.querySelectorAll('.square__can-take').forEach((square) => {
      square.parentElement.removeEventListener('click', endTurn);
      square.remove();
    });
    if (document.querySelector('.piece__active')) {
      document.querySelector('.piece__active').remove();
    }
  },
};

// function for all pieces on click
function pieceFun(pieceObj) {
  // checking if chosen piece side can be moved now
  if (document.getElementById(pieceObj.id).dataset.color === activeSide()) {
    pieceObj.move();
    // checking if all of the pieces are inactive to make one of them active
    if (!isPieceActive) {
      isPieceActive = true;
    }
    // defining which piece is active or making piece inactive if it was chosen second time
    if (activePieceId === pieceObj.id) {
      // remove an active mark
      marks.removeMark();

      isPieceActive = false;
      activePieceId = '';
    } else {
      activePieceId = pieceObj.id;

      // remove an active mark if there is one
      marks.removeMark();
      document.querySelector('.piece__active') ? document.querySelector('.piece__active').remove() : false;

      // add an active mark
      const activePieceHtml = document.createElement('div');
      activePieceHtml.className = 'piece__active';
      document.getElementById(pieceObj.id).parentElement.appendChild(activePieceHtml);

      marks.addMark(pieceObj);
    }
  }
}

// function which assigns necessary class for piece
function createPiece(name, color, id, isFirstMove) {
  switch (name) {
    case 'pawn':
      return new Pawn(name, color, id, isFirstMove);

    case 'rook':
      return new Rook(name, color, id, isFirstMove);

    case 'bishop':
      return new Bishop(name, color, id, isFirstMove);

    case 'knight':
      return new Knight(name, color, id, isFirstMove);

    case 'queen':
      return new Queen(name, color, id, isFirstMove);

    case 'king':
      return new King(name, color, id, isFirstMove);
  }
}

// add all pieces to board
let id = 1;
pieces.forEach((piece) => {
  for (const [color, arrayOfSquares] of Object.entries(piece.startingSquare)) {
    // add one piece on board
    arrayOfSquares.forEach((square) => {
      const pieceId = `piece${id}`;
      id++;

      const pieceHtmlElement = `
      <div class="piece" id="${pieceId}" name="${piece.name}" data-color="${color}" data-is-first-move="true">
        <img src="img/pieces/${color}/${piece.name}.png" />
      </div>
      `;
      document.getElementById(square).innerHTML = pieceHtmlElement;

      // add event listener for each piece
      document.getElementById(pieceId).addEventListener('click', () => {
        const chessPiece = createPiece(piece.name, color, pieceId, true);
        // allow movement only when it is its turn
        if (activeSide() === chessPiece.color) {
          pieceFun(chessPiece);
        }
      });
    });
  }
});

// unfinished functions : pieceFun(); move() methods;
