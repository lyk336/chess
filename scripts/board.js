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
  move(filledAltBoard) {
    const availableSquares = [];
    const canTakePieceSquares = [];

    let altBoard = [];
    if (filledAltBoard) {
      altBoard = filledAltBoard;
    } else {
      fillAltBoard(altBoard);
    }

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
  move(filledAltBoard) {
    const availableSquares = [];
    const canTakePieceSquares = [];

    let altBoard = [];
    if (filledAltBoard) {
      altBoard = filledAltBoard;
    } else {
      fillAltBoard(altBoard);
    }

    const squareId = document.getElementById(this.id).parentElement.id;
    const rookPosition = {
      column: columnIndex.indexOf(squareId[0]),
      row: +squareId[1] - 1,
    };

    // if direction = -1, then it's mean that rook moves left or down; if direction =1 => moves top or right
    for (let direction = -1; direction <= 1; direction++) {
      if (direction === 0) {
        continue;
      }
      // check whole row
      for (let column = rookPosition.column + direction; column >= 0 && column <= 7; column += direction) {
        if (altBoard[column][rookPosition.row][0] && altBoard[column][rookPosition.row][0].color === this.color) {
          // if allied piece
          break;
        } else if (altBoard[column][rookPosition.row][0] && altBoard[column][rookPosition.row][0].color !== this.color) {
          // if enemy piece
          canTakePieceSquares.push(`${columnIndex[column]}${rookPosition.row + 1}`);
          break;
        } else {
          // if square is empty
          availableSquares.push(`${columnIndex[column]}${rookPosition.row + 1}`);
        }
      }
      // check whole column
      for (let row = rookPosition.row + direction; row >= 0 && row <= 7; row += direction) {
        if (altBoard[rookPosition.column][row][0] && altBoard[rookPosition.column][row][0].color === this.color) {
          // if allied piece
          break;
        } else if (altBoard[rookPosition.column][row][0] && altBoard[rookPosition.column][row][0].color !== this.color) {
          // if enemy piece
          canTakePieceSquares.push(`${columnIndex[rookPosition.column]}${row + 1}`);
          break;
        } else {
          // if square is empty
          availableSquares.push(`${columnIndex[rookPosition.column]}${row + 1}`);
        }
      }
    }

    return {
      availableSquares,
      canTakePieceSquares,
    };
  }
}
class Bishop extends ChessPiece {
  move(filledAltBoard) {
    const availableSquares = [];
    const canTakePieceSquares = [];

    let altBoard = [];
    if (filledAltBoard) {
      altBoard = filledAltBoard;
    } else {
      fillAltBoard(altBoard);
    }

    const squareId = document.getElementById(this.id).parentElement.id;
    const bishopPosition = {
      column: columnIndex.indexOf(squareId[0]),
      row: +squareId[1] - 1,
    };

    // if columnDirection = -1, then it's mean that bishop moves to left; if columnDirection = 1 => moves to right
    // if rowDirection = -1, then it's mean that bishop moves to bottom; if rowDirection = 1 => moves to top

    for (let columnDirection = -1; columnDirection <= 1; columnDirection++) {
      if (columnDirection === 0) {
        continue;
      }
      for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {
        if (rowDirection === 0) {
          continue;
        }

        let column = bishopPosition.column + columnDirection;
        let row = bishopPosition.row + rowDirection;
        while (column >= 0 && column <= 7 && row >= 0 && row <= 7) {
          if (altBoard[column][row][0]) {
            if (altBoard[column][row][0].color !== this.color) {
              canTakePieceSquares.push(`${columnIndex[column]}${row + 1}`);
              break;
            } else {
              break;
            }
          } else {
            availableSquares.push(`${columnIndex[column]}${row + 1}`);
            column += columnDirection;
            row += rowDirection;
          }
        }
      }
    }

    return {
      availableSquares,
      canTakePieceSquares,
    };
  }
}
class Knight extends ChessPiece {
  move(filledAltBoard) {
    const availableSquares = [];
    const canTakePieceSquares = [];

    let altBoard = [];
    if (filledAltBoard) {
      altBoard = filledAltBoard;
    } else {
      fillAltBoard(altBoard);
    }

    const squareId = document.getElementById(this.id).parentElement.id;
    const knightPosition = {
      column: columnIndex.indexOf(squareId[0]),
      row: +squareId[1] - 1,
    };

    for (let columnPosition = -2; columnPosition <= 2; columnPosition++) {
      if (columnPosition === 0) {
        continue;
      }

      for (let rowPosition = -2; rowPosition <= 2; rowPosition++) {
        // nonexistent options
        if (rowPosition === 0 || rowPosition === columnPosition || rowPosition === columnPosition * -1) {
          continue;
        }

        const column = knightPosition.column + columnPosition;
        const row = knightPosition.row + rowPosition;

        if (column >= 0 && row >= 0 && column <= 7 && row <= 7) {
          let knightsCell = altBoard[column][row];
          // check if this cell exists
          if (knightsCell) {
            if (knightsCell[0] && knightsCell[0].color !== this.color) {
              canTakePieceSquares.push(`${columnIndex[column]}${row + 1}`);
            } else if (knightsCell[0] && knightsCell[0].color === this.color) {
              continue;
            } else {
              availableSquares.push(`${columnIndex[column]}${row + 1}`);
            }
          }
        } else {
          continue;
        }
      }
    }

    return {
      availableSquares,
      canTakePieceSquares,
    };
  }
}
class Queen extends ChessPiece {
  move(filledAltBoard) {
    const availableSquares = [];
    const canTakePieceSquares = [];

    let altBoard = [];
    if (filledAltBoard) {
      altBoard = filledAltBoard;
    } else {
      fillAltBoard(altBoard);
    }

    const squareId = document.getElementById(this.id).parentElement.id;
    const queenPosition = {
      column: columnIndex.indexOf(squareId[0]),
      row: +squareId[1] - 1,
    };

    // rook move
    // if direction = -1, then it's mean that queen moves left or down; if direction =1 => moves top or right
    for (let direction = -1; direction <= 1; direction++) {
      if (direction === 0) {
        continue;
      }
      // check whole row
      for (let column = queenPosition.column + direction; column >= 0 && column <= 7; column += direction) {
        if (altBoard[column][queenPosition.row][0] && altBoard[column][queenPosition.row][0].color === this.color) {
          // if allied piece
          break;
        } else if (altBoard[column][queenPosition.row][0] && altBoard[column][queenPosition.row][0].color !== this.color) {
          // if enemy piece
          canTakePieceSquares.push(`${columnIndex[column]}${queenPosition.row + 1}`);
          break;
        } else {
          // if square is empty
          availableSquares.push(`${columnIndex[column]}${queenPosition.row + 1}`);
        }
      }
      // check whole column
      for (let row = queenPosition.row + direction; row >= 0 && row <= 7; row += direction) {
        if (altBoard[queenPosition.column][row][0] && altBoard[queenPosition.column][row][0].color === this.color) {
          // if allied piece
          break;
        } else if (altBoard[queenPosition.column][row][0] && altBoard[queenPosition.column][row][0].color !== this.color) {
          // if enemy piece
          canTakePieceSquares.push(`${columnIndex[queenPosition.column]}${row + 1}`);
          break;
        } else {
          // if square is empty
          availableSquares.push(`${columnIndex[queenPosition.column]}${row + 1}`);
        }
      }
    }

    // bishop move
    // if columnDirection = -1, then it's mean that queen moves to left; if columnDirection = 1 => moves to right
    // if rowDirection = -1, then it's mean that queen moves to bottom; if rowDirection = 1 => moves to top

    for (let columnDirection = -1; columnDirection <= 1; columnDirection++) {
      if (columnDirection === 0) {
        continue;
      }
      for (let rowDirection = -1; rowDirection <= 1; rowDirection++) {
        if (rowDirection === 0) {
          continue;
        }

        let column = queenPosition.column + columnDirection;
        let row = queenPosition.row + rowDirection;
        while (column >= 0 && column <= 7 && row >= 0 && row <= 7) {
          if (altBoard[column][row][0]) {
            if (altBoard[column][row][0].color !== this.color) {
              canTakePieceSquares.push(`${columnIndex[column]}${row + 1}`);
              break;
            } else {
              break;
            }
          } else {
            availableSquares.push(`${columnIndex[column]}${row + 1}`);
            column += columnDirection;
            row += rowDirection;
          }
        }
      }
    }

    return {
      availableSquares,
      canTakePieceSquares,
    };
  }
}
class King extends ChessPiece {
  move(filledAltBoard) {
    const availableSquares = [];
    const canTakePieceSquares = [];

    let altBoard = [];
    if (filledAltBoard) {
      altBoard = filledAltBoard;
    } else {
      fillAltBoard(altBoard);
    }

    const squareId = document.getElementById(this.id).parentElement.id;
    const kingPosition = {
      column: columnIndex.indexOf(squareId[0]),
      row: +squareId[1] - 1,
    };

    for (let columnPosition = -1; columnPosition <= 1; columnPosition++) {
      for (let rowPosition = -1; rowPosition <= 1; rowPosition++) {
        // this is king's position so it's invalid square for checking
        if (columnPosition === 0 && rowPosition === 0) {
          continue;
        }
        const column = kingPosition.column + columnPosition;
        const row = kingPosition.row + rowPosition;
        if (altBoard[column][row]) {
          if (altBoard[column][row][0] && altBoard[column][row][0].color !== this.color) {
            canTakePieceSquares.push(`${columnIndex[column]}${row + 1}`);
          } else if (altBoard[column][row][0] && altBoard[column][row][0].color === this.color) {
            continue;
          } else {
            availableSquares.push(`${columnIndex[column]}${row + 1}`);
          }
        }
      }
    }

    return {
      availableSquares,
      canTakePieceSquares,
    };
  }
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
    const validAvailableSquares = [];
    const validCanTakePieceSquares = [];
    const pieceStartPosition = {
      column: columnIndex.indexOf(document.getElementById(pieceObj.id).parentElement.id[0]),
      row: +document.getElementById(pieceObj.id).parentElement.id[1] - 1,
    };

    // we check if after move allied king won't be under check
    function findValidsSquares(square, validArray) {
      const altBoard = [];
      fillAltBoard(altBoard);

      const newPiecePosition = {
        column: columnIndex.indexOf(square[0]),
        row: +square[1] - 1,
      };

      // dlear previous location
      altBoard[pieceStartPosition.column][pieceStartPosition.row].length = 0;
      // clear new location if there is enemy piece
      altBoard[newPiecePosition.column][newPiecePosition.row].length = 0;
      altBoard[newPiecePosition.column][newPiecePosition.row].push(
        createPiece(pieceObj.name, pieceObj.color, pieceObj.id, pieceObj.isFirstMove)
      );

      // checking all enemy pieces
      let isValidMove = true;
      for (let column = 0; column <= 7; column++) {
        for (let row = 0; row <= 7; row++) {
          const piece = altBoard[column][row][0];
          if (piece && piece.color !== pieceObj.color) {
            piece.move(altBoard).canTakePieceSquares.forEach((attackedSquare) => {
              const attackedPiecePosition = {
                column: columnIndex.indexOf(attackedSquare[0]),
                row: +attackedSquare[1] - 1,
              };
              // console.log(attackedPiecePosition, attackedSquare);
              if (
                altBoard[attackedPiecePosition.column][attackedPiecePosition.row][0] &&
                altBoard[attackedPiecePosition.column][attackedPiecePosition.row][0].name === 'king'
              ) {
                isValidMove = false;
              }
            });
          }
        }
        if (!isValidMove) {
          break;
        }
      }
      if (isValidMove) {
        validArray.push(square);
      }
    }

    pieceObj.move().availableSquares.forEach((square) => {
      findValidsSquares(square, validAvailableSquares);
    });
    pieceObj.move().canTakePieceSquares.forEach((square) => {
      findValidsSquares(square, validCanTakePieceSquares);
    });

    // mark all valid moves
    validAvailableSquares.forEach((square) => {
      const squareMarkElement = document.createElement('div');
      squareMarkElement.className = 'square__available';
      document.getElementById(square).appendChild(squareMarkElement);
    });

    validCanTakePieceSquares.forEach((square) => {
      const squareMarkElement = document.createElement('div');
      squareMarkElement.className = 'square__can-take';
      document.getElementById(square).appendChild(squareMarkElement);
    });
  },
  removeMark() {
    document.querySelectorAll('.square__available').forEach((square) => {
      square.remove();
    });
    document.querySelectorAll('.square__can-take').forEach((square) => {
      square.remove();
    });
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
      document.querySelector('.piece__active').remove();

      isPieceActive = false;
      activePieceId = '';
    } else {
      activePieceId = pieceObj.id;

      // remove an active mark if there is one
      marks.removeMark();
      document.querySelector('.piece__active') ? document.querySelector('.piece__active').remove() : false;

      // add an active mark
      const activeMarkHtml = document.createElement('div');
      activeMarkHtml.className = 'piece__active';
      document.getElementById(pieceObj.id).parentElement.appendChild(activeMarkHtml);

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
        const chessPiece = createPiece(piece.name, color, pieceId, document.getElementById(pieceId).dataset.isFirstMove);
        // allow movement only when it is its turn
        if (activeSide() === chessPiece.color) {
          pieceFun(chessPiece);
        }
      });
    });
  }
});

// add to all squares event listener
document.querySelectorAll('.board__square').forEach((square) => {
  square.addEventListener('click', () => {
    // allow movement only when square have mark
    if (square.querySelector('.square__available') || square.querySelector('.square__can-take')) {
      // we can't take kings so we check if this cell has king or not
      if (square.contains(square.querySelector('.piece')) && square.querySelector('.piece').getAttribute('name') === 'king') {
        return;
      }
      // make move
      // clear square and then move piece
      const activePieceElement = document.getElementById(activePieceId);
      square.innerHTML = '';
      square.appendChild(activePieceElement);
      // remove first move data attribute
      activePieceElement.removeAttribute('data-is-first-move');
      // remove marks
      marks.removeMark();
      document.querySelector('.piece__active').remove();
      // end turn
      isPieceActive = false;
      currentTurn++;
      activePieceId = '';
    }
  });
});

// unfinished functions : move() methods;
