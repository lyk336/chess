import { pieces } from './data/pieces.js';

const board = document.getElementById('board');
const columns = document.querySelectorAll('.board__column');
const columnIndex = [null, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

class ChessPiece {
  name;
  color;
  id;
  #isFirstMove;
  disableFirstMove() {
    this.#isFirstMove = false;
  }
  move() {
    const availableCells = [];
    const canTakePiece = [];

    const pieceElement = document.getElementById(this.id);
    const pieceLocation = {
      column: columnIndex.findIndex((element) => element === pieceElement.parentElement.id[0]),
      row: +pieceElement.parentElement.id[1],
    };

    function isCheck() {
      kingMove();
    }
    isCheck();

    let col, row;
    switch (this.name) {
      case 'king':
        // movement
        function kingMove(king) {
          console.log(this);
          row = pieceLocation.row;
          col = pieceLocation.column;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              // check if this element exists
              const element = document.getElementById(`${columnIndex[col + i]}${row + j}`);
              if (element) {
                // skip when cell with this king
                if (element.contains(document.getElementById(king.id))) {
                  continue;
                } else if (element.contains(element.querySelector('.piece'))) {
                  if (element.querySelector('.piece').dataset.color !== king.color) {
                    canTakePiece.push(element.id);
                  } else {
                    continue;
                  }
                } else {
                  availableCells.push(element.id);
                }
              }
            }
          }
        }

        kingMove(this);

        break;

      case 'queen':
        // queen's movement = bishop + rook
        bishopMove(this);
        rookMove(this);

        break;

      case 'bishop':
        // creating function because of queen's movements
        function bishopMove(bishop) {
          // from bishop to top right corner
          col = pieceLocation.column + 1;
          row = pieceLocation.row + 1;

          while (col <= 8 && row <= 8) {
            if (
              document
                .getElementById(`${columnIndex[col]}${row}`)
                .contains(document.getElementById(`${columnIndex[col]}${row}`).querySelector('.piece'))
            ) {
              if (document.getElementById(`${columnIndex[col]}${row}`).querySelector('.piece').dataset.color !== bishop.color) {
                canTakePiece.push(`${columnIndex[col]}${row}`);
                break;
              } else {
                break;
              }
            } else {
              availableCells.push(`${columnIndex[col]}${row}`);
              col++;
              row++;
            }
          }

          // from bishop to top right corner
          col = pieceLocation.column + 1;
          row = pieceLocation.row - 1;

          while (col <= 8 && row >= 1) {
            if (
              document
                .getElementById(`${columnIndex[col]}${row}`)
                .contains(document.getElementById(`${columnIndex[col]}${row}`).querySelector('.piece'))
            ) {
              if (document.getElementById(`${columnIndex[col]}${row}`).querySelector('.piece').dataset.color !== bishop.color) {
                canTakePiece.push(`${columnIndex[col]}${row}`);
                break;
              } else {
                break;
              }
            } else {
              availableCells.push(`${columnIndex[col]}${row}`);
              col++;
              row--;
            }
          }

          // from bishop to bottom left corner
          col = pieceLocation.column - 1;
          row = pieceLocation.row - 1;

          while (col >= 1 && row >= 1) {
            if (
              document
                .getElementById(`${columnIndex[col]}${row}`)
                .contains(document.getElementById(`${columnIndex[col]}${row}`).querySelector('.piece'))
            ) {
              if (document.getElementById(`${columnIndex[col]}${row}`).querySelector('.piece').dataset.color !== bishop.color) {
                canTakePiece.push(`${columnIndex[col]}${row}`);
                break;
              } else {
                break;
              }
            } else {
              availableCells.push(`${columnIndex[col]}${row}`);
              col--;
              row--;
            }
          }

          // from bishop to bottom right corner
          col = pieceLocation.column - 1;
          row = pieceLocation.row + 1;

          while (col >= 1 && row <= 8) {
            if (
              document
                .getElementById(`${columnIndex[col]}${row}`)
                .contains(document.getElementById(`${columnIndex[col]}${row}`).querySelector('.piece'))
            ) {
              if (document.getElementById(`${columnIndex[col]}${row}`).querySelector('.piece').dataset.color !== bishop.color) {
                canTakePiece.push(`${columnIndex[col]}${row}`);
                break;
              } else {
                break;
              }
            } else {
              availableCells.push(`${columnIndex[col]}${row}`);
              col--;
              row++;
            }
          }
        }

        bishopMove(this);

        break;

      case 'knight':
        function knightMove(knight) {
          let knightsCell;

          const moveKnight = function () {
            // check if this cell exists
            if (knightsCell) {
              if (knightsCell.contains(knightsCell.querySelector('.piece'))) {
                if (knightsCell.querySelector('.piece').dataset.color !== knight.color) {
                  canTakePiece.push(knightsCell.id);
                }
              } else {
                availableCells.push(knightsCell.id);
              }
            }
          };
          // top-right area
          // 1)
          col = pieceLocation.column + 2;
          row = pieceLocation.row + 1;
          knightsCell = document.getElementById(`${columnIndex[col]}${row}`);

          moveKnight();

          // 2)
          col = pieceLocation.column + 1;
          row = pieceLocation.row + 2;
          knightsCell = document.getElementById(`${columnIndex[col]}${row}`);

          moveKnight();

          // top-left area
          // 1)
          col = pieceLocation.column + 2;
          row = pieceLocation.row - 1;
          knightsCell = document.getElementById(`${columnIndex[col]}${row}`);

          moveKnight();
          // 2)
          col = pieceLocation.column + 1;
          row = pieceLocation.row - 2;
          knightsCell = document.getElementById(`${columnIndex[col]}${row}`);

          moveKnight();

          // bottom-right area
          // 1)
          col = pieceLocation.column - 2;
          row = pieceLocation.row - 1;
          knightsCell = document.getElementById(`${columnIndex[col]}${row}`);

          moveKnight();
          // 2)
          col = pieceLocation.column - 1;
          row = pieceLocation.row - 2;
          knightsCell = document.getElementById(`${columnIndex[col]}${row}`);

          moveKnight();

          // bottom-left area
          // 1)
          col = pieceLocation.column - 2;
          row = pieceLocation.row + 1;
          knightsCell = document.getElementById(`${columnIndex[col]}${row}`);

          moveKnight();
          // 2)
          col = pieceLocation.column - 1;
          row = pieceLocation.row + 2;
          knightsCell = document.getElementById(`${columnIndex[col]}${row}`);

          moveKnight();
        }
        knightMove(this);
        break;

      case 'rook':
        // creating function because of queen's movements
        function rookMove(rook) {
          // check lines
          // from rook to bottom
          for (let i = pieceLocation.row - 1; i >= 1; i--) {
            if (
              document
                .getElementById(`${columnIndex[pieceLocation.column]}${i}`)
                .contains(document.getElementById(`${columnIndex[pieceLocation.column]}${i}`).querySelector('.piece'))
            ) {
              if (
                document.getElementById(`${columnIndex[pieceLocation.column]}${i}`).querySelector('.piece').dataset.color !== rook.color
              ) {
                canTakePiece.push(`${columnIndex[pieceLocation.column]}${i}`);
                break;
              } else {
                break;
              }
            } else {
              availableCells.push(`${columnIndex[pieceLocation.column]}${i}`);
            }
          }

          // from rook to top
          for (let i = pieceLocation.row + 1; i <= 8; i++) {
            if (
              document
                .getElementById(`${columnIndex[pieceLocation.column]}${i}`)
                .contains(document.getElementById(`${columnIndex[pieceLocation.column]}${i}`).querySelector('.piece'))
            ) {
              if (
                document.getElementById(`${columnIndex[pieceLocation.column]}${i}`).querySelector('.piece').dataset.color !== rook.color
              ) {
                canTakePiece.push(`${columnIndex[pieceLocation.column]}${i}`);
                break;
              } else {
                break;
              }
            } else {
              availableCells.push(`${columnIndex[pieceLocation.column]}${i}`);
            }
          }

          // from rook to left
          for (let i = pieceLocation.column - 1; i >= 1; i--) {
            if (
              document
                .getElementById(`${columnIndex[i]}${pieceLocation.row}`)
                .contains(document.getElementById(`${columnIndex[i]}${pieceLocation.row}`).querySelector('.piece'))
            ) {
              if (document.getElementById(`${columnIndex[i]}${pieceLocation.row}`).querySelector('.piece').dataset.color !== rook.color) {
                canTakePiece.push(`${columnIndex[i]}${pieceLocation.row}`);
                break;
              } else {
                break;
              }
            } else {
              availableCells.push(`${columnIndex[i]}${pieceLocation.row}`);
            }
          }

          // from rook to right
          for (let i = pieceLocation.column + 1; i <= 8; i++) {
            if (
              document
                .getElementById(`${columnIndex[i]}${pieceLocation.row}`)
                .contains(document.getElementById(`${columnIndex[i]}${pieceLocation.row}`).querySelector('.piece'))
            ) {
              if (document.getElementById(`${columnIndex[i]}${pieceLocation.row}`).querySelector('.piece').dataset.color !== rook.color) {
                canTakePiece.push(`${columnIndex[i]}${pieceLocation.row}`);
                break;
              } else {
                break;
              }
            } else {
              availableCells.push(`${columnIndex[i]}${pieceLocation.row}`);
            }
          }
        }

        rookMove(this);

        break;

      case 'pawn':
        function pawnMove(pawn) {
          //set direction for pawn and check wheter it's first pawn's move
          let direction;
          if (pawn.color === 'white') {
            direction = 1;
          } else {
            direction = -1;
          }

          //check top left corner for whites or bottom left corner for blacks (take piece)
          if (
            columnIndex[pieceLocation.column - 1] &&
            pieceLocation.row + direction >= 1 &&
            pieceLocation.row + direction <= 8 &&
            document.getElementById(`${columnIndex[pieceLocation.column - 1]}${pieceLocation.row + direction}`).childElementCount !== 0 &&
            document.getElementById(`${columnIndex[pieceLocation.column - 1]}${pieceLocation.row + direction}`).querySelector('.piece')
              .dataset.color !== pawn.color
          ) {
            const cellId = `${columnIndex[pieceLocation.column - 1]}${pieceLocation.row + direction}`;
            canTakePiece.push(cellId);
          }

          //check top right corner for whites or bottom right corner for blacks (take piece)
          if (
            columnIndex[pieceLocation.column + 1] &&
            pieceLocation.row + direction >= 1 &&
            pieceLocation.row + direction <= 8 &&
            document.getElementById(`${columnIndex[pieceLocation.column + 1]}${pieceLocation.row + direction}`).childElementCount !== 0 &&
            document.getElementById(`${columnIndex[pieceLocation.column + 1]}${pieceLocation.row + direction}`).querySelector('.piece')
              .dataset.color !== pawn.color
          ) {
            const cellId = `${columnIndex[pieceLocation.column + 1]}${pieceLocation.row + direction}`;
            canTakePiece.push(cellId);
          }

          // if next cell contains piece => can't move
          if (
            pieceLocation.row + direction >= 1 &&
            pieceLocation.row + direction <= 8 &&
            document.getElementById(`${columnIndex[pieceLocation.column]}${pieceLocation.row + direction}`).childElementCount === 0
          ) {
            availableCells.push(`${columnIndex[pieceLocation.column]}${pieceLocation.row + direction}`);

            if (pawn.#isFirstMove) {
              direction *= 2;
              if (
                pieceLocation.row + direction >= 1 &&
                pieceLocation.row + direction <= 8 &&
                document.getElementById(`${columnIndex[pieceLocation.column]}${pieceLocation.row + direction}`).childElementCount === 0
              ) {
                availableCells.push(`${columnIndex[pieceLocation.column]}${pieceLocation.row + direction}`);
              }
            }
          }
        }

        pawnMove(this);

        break;
    }

    return {
      availableCells,
      canTakePiece,
    };
  }
  constructor(name, color, id) {
    this.name = name;
    this.color = color;
    this.id = id;
    this.#isFirstMove = true;
  }
}

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

// function for all pieces
function pieceFun(pieceObj) {
  // checking if chosen piece side can be moved now
  if (document.getElementById(pieceObj.id).dataset.color === activeSide()) {
    // checking if one of the pieces is inactive to make it active
    if (!isPieceActive) {
      isPieceActive = true;
    }
    // defining which piece is active or making piece inactive if it was chosen second time
    if (activePieceId === pieceObj.id) {
      // remove an active mark
      removeAvailableCells();
      document.querySelector('.piece__active').remove();

      isPieceActive = false;
      activePieceId = '';
    } else {
      activePieceId = pieceObj.id;

      // remove an active mark if there is one
      removeAvailableCells();
      document.querySelector('.piece__active') ? document.querySelector('.piece__active').remove() : false;

      // add an active mark
      const activePieceHtml = document.createElement('div');
      activePieceHtml.className = 'piece__active';
      document.getElementById(pieceObj.id).parentElement.appendChild(activePieceHtml);

      addAvailableCells(pieceObj);
    }
    console.log(pieceObj.move());
  }
}

// function to show availible cells to move and function which removes them
function addAvailableCells(pieceObj) {
  pieceObj.move().availableCells.forEach((cell) => {
    const availableCell = document.createElement('div');
    availableCell.className = 'cell__availible';
    document.getElementById(cell).appendChild(availableCell);
  });

  pieceObj.move().canTakePiece.forEach((cell) => {
    const takenCell = document.createElement('div');
    takenCell.className = 'cell__can-take';
    document.getElementById(cell).appendChild(takenCell);
  });
}

function removeAvailableCells() {
  if (document.querySelector('.cell__availible')) {
    document.querySelectorAll('.cell__availible').forEach((cell) => {
      cell.remove();
    });
  }
  if (document.querySelector('.cell__can-take')) {
    document.querySelectorAll('.cell__can-take').forEach((cell) => {
      cell.remove();
    });
  }
}

// add piece on board
let id = 1;
pieces.forEach((piece) => {
  Object.entries(piece.startingCell).forEach(([color, cell]) => {
    cell.forEach((cell) => {
      const pieceId = `piece${id}`;
      const pieceHTML = `
        <div class="piece" id="${pieceId}" name="${piece.name}" data-color="${color}">
          <img src="img/pieces/${color}/${piece.name}.png" />
        </div>
      `;

      // adding on board
      document.getElementById(cell).innerHTML = pieceHTML;

      // adding event listener for clicking on piece
      document.getElementById(pieceId).addEventListener('click', () => {
        // creating piece using class
        const chessPiece = new ChessPiece(
          document.getElementById(pieceId).getAttribute('name'),
          document.getElementById(pieceId).dataset.color,
          pieceId
        );

        pieceFun(chessPiece);
      });
      id++;
    });
  });
});

// adding event listener for all cells

document.querySelectorAll('.board__cell').forEach((cell) => {
  cell.addEventListener('click', () => {
    let pieceId;

    const replaceChess = function () {
      // we can't take kings so we check is this cell have king or not
      if (cell.contains(cell.querySelector('.piece')) && cell.querySelector('.piece').getAttribute('name') === 'king') {
        return;
      }

      const html = document.getElementById(activePieceId).cloneNode(true);
      cell.innerHTML = '';
      document.getElementById(activePieceId).remove();
      cell.appendChild(html);

      document.getElementById(html.id).addEventListener('click', () => {
        const chessPiece = new ChessPiece(
          document.getElementById(html.id).getAttribute('name'),
          document.getElementById(html.id).dataset.color,
          html.id
        );

        chessPiece.disableFirstMove();
        pieceFun(chessPiece);
      });

      // remove an active mark
      removeAvailableCells();
      document.querySelector('.piece__active').remove();

      isPieceActive = false;
      activePieceId = null;
      currentTurn++;
    };

    // permission to move only when one of the pieces was chosen
    if (isPieceActive && cell.contains(cell.querySelector('.cell__availible') || cell.querySelector('.cell__can-take'))) {
      // checking if this cell contains piece
      if (cell.contains(cell.querySelector('.piece'))) {
        pieceId = cell.querySelector('.piece').id;

        // if piece move on opponent's piece, it eat(replaces) it
        if (document.getElementById(pieceId).dataset.color !== activeSide()) {
          replaceChess();
        }
      } else {
        pieceId = null;
        replaceChess();
      }
    }
  });
});
