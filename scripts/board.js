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

// all movement functions
const availableCells = [];
const canTakePiece = [];

function isCheck(kingColor) {
  let king;

  const altBoard = [];
  for (let i = 0; i < 8; i++) {
    altBoard.push([]);
    for (let j = 0; j < 8; j++) {
      altBoard[i].push([]);
    }
  }
  document.querySelectorAll('.piece').forEach((piece) => {
    const column = columnIndex.findIndex((element) => element === piece.parentElement.id[0]);
    const row = +piece.parentElement.id[1] - 1;

    const pieceName = piece.getAttribute('name');
    const pieceColor = piece.dataset.color;
    const pieceId = piece.id;
    const pieceIsFirstMove = piece.isFirstMove;

    altBoard[column][row].push(new ChessPiece(pieceName, pieceColor, pieceId, pieceIsFirstMove));

    if (pieceName === 'king' && pieceColor === kingColor) {
      king = altBoard[column][row][0];
    }
  });

  const originalAvailableCells = availableCells.slice();
  const originalCanTakePiece = canTakePiece.slice();
  let localCanTakePiece = [];
  let localAvailableCells = [];

  let isCheck;
  for (let col = 0; col <= 7; col++) {
    for (let row = 0; row <= 7; row++) {
      if (altBoard[col][row][0] && altBoard[col][row][0].color === activeSide()) {
        if (altBoard[col][row][0].move().canTakePiece.length > 0) {
          const arr = altBoard[col][row][0].move().canTakePiece;
          localCanTakePiece = arr.filter((value, index) => arr.indexOf(value) === index);

          localCanTakePiece.forEach((cell) => {
            const cellCol = columnIndex.findIndex((element) => element === cell[0]);
            const cellRow = +cell[1] - 1;

            // console.log(king);
            if (altBoard[cellCol][cellRow][0].id === king.id) {
              isCheck = true;
            }
          });
        }
      }
    }
  }
  localAvailableCells = [];

  availableCells.length = 0;
  originalAvailableCells.forEach((cell) => {
    availableCells.push(cell);
  });
  canTakePiece.length = 0;
  originalCanTakePiece.forEach((cell) => {
    canTakePiece.push(cell);
  });

  return isCheck;
}
// check if moves inside availableCells are valid
function isValidMove() {
  // create alternative board
  const altBoard = [];
  for (let i = 0; i < 8; i++) {
    altBoard.push([]);
    for (let j = 0; j < 8; j++) {
      altBoard[i].push([]);
    }
  }
  document.querySelectorAll('.piece').forEach((piece) => {
    const column = columnIndex.findIndex((element) => element === piece.parentElement.id[0]);
    const row = +piece.parentElement.id[1] - 1;

    const pieceName = piece.getAttribute('name');
    const pieceColor = piece.dataset.color;
    const pieceId = piece.id;
    const pieceIsFirstMove = piece.dataset.isFirstMove || false;

    altBoard[column][row].push(new ChessPiece(pieceName, pieceColor, pieceId, pieceIsFirstMove));
  });
  // -----------------------------

  const availableCellsPrototype = availableCells.filter((value, index) => availableCells.indexOf(value) === index);
  const canTakePiecePrototype = canTakePiece.filter((value, index) => canTakePiece.indexOf(value) === index);

  // active piece
  const activePieceColumn = columnIndex.findIndex((element) => element === document.getElementById(activePieceId).parentElement.id[0]);
  const activePieceRow = +document.getElementById(activePieceId).parentElement.id[1] - 1;
  const activePieceLocation = altBoard[activePieceColumn][activePieceRow];
  const activePiece = {
    name: document.getElementById(activePieceId).getAttribute('name'),
    color: document.getElementById(activePieceId).dataset.color,
    id: document.getElementById(activePieceId).id,
    isFirstMove: document.getElementById(activePieceId).dataset.isFirstMove,
  };
  // ----------------

  function updateAvailibleCellsArray(arrayPrototype, array) {
    arrayPrototype.forEach((cell) => {
      // changing location of piece
      activePieceLocation.length = 0;
      const col = columnIndex.findIndex((element) => element === cell[0]);
      const row = +cell[1] - 1;
      const changedLocation = altBoard[col][row];
      changedLocation.push(new ChessPiece(activePiece.name, activePiece.color, activePiece.id, activePiece.isFirstMove));
      // ---------------------------

      const kingColor = activeSide() === 'white' ? 'white' : 'black';
      let kingCell;
      for (let i = 0; i <= 7; i++) {
        for (let j = 0; j <= 7; j++) {
          if (altBoard[i][j][0] && altBoard[i][j][0].color === kingColor && altBoard[i][j][0].name === 'king') {
            kingCell = altBoard[i][j];
            break;
          }
        }
      }

      for (let i = 0; i <= 7; i++) {
        for (let j = 0; j <= 7; j++) {
          if (altBoard[i][j][0] && altBoard[i][j][0].color !== kingColor) {
            altBoard[i][j][0].move().canTakePiece.forEach((newCell) => {
              const canTakePieceColumn = columnIndex.findIndex((element) => element === newCell[0]);
              const canTakePieceRow = +newCell[1] - 1;

              if (kingCell === altBoard[canTakePieceColumn][canTakePieceRow]) {
                console.log(kingCell, '===', altBoard);
                const invalidValueIndex = arrayPrototype.indexOf(cell);
                arrayPrototype.splice(invalidValueIndex, 1);
              }
              canTakePiece.length = 0;
              availableCells.length = 0;
            });
          }
        }
      }
    });
    array.length = 0;
    arrayPrototype.forEach((cell) => {
      array.push(cell);
    });
  }
  updateAvailibleCellsArray(availableCellsPrototype, availableCells);
  updateAvailibleCellsArray(canTakePiecePrototype, canTakePiece);
}

function rookMove(rook, pieceLocation, altBoard) {
  // check lines
  // from rook to bottom
  for (let i = pieceLocation.row - 1; i >= 0; i--) {
    if (altBoard[pieceLocation.column][i].length === 1) {
      if (altBoard[pieceLocation.column][i][0].color !== rook.color) {
        canTakePiece.push(`${columnIndex[pieceLocation.column]}${i + 1}`);
        break;
      } else {
        break;
      }
    } else {
      availableCells.push(`${columnIndex[pieceLocation.column]}${i + 1}`);
    }
  }

  // from rook to top
  for (let i = pieceLocation.row + 1; i <= 7; i++) {
    if (altBoard[pieceLocation.column][i].length === 1) {
      if (altBoard[pieceLocation.column][i][0].color !== rook.color) {
        canTakePiece.push(`${columnIndex[pieceLocation.column]}${i + 1}`);
        break;
      } else {
        break;
      }
    } else {
      availableCells.push(`${columnIndex[pieceLocation.column]}${i + 1}`);
    }
  }

  // from rook to left
  for (let i = pieceLocation.column - 1; i >= 0; i--) {
    if (altBoard[i][pieceLocation.row].length === 1) {
      if (altBoard[i][pieceLocation.row][0].color !== rook.color) {
        canTakePiece.push(`${columnIndex[i]}${pieceLocation.row + 1}`);

        break;
      } else {
        break;
      }
    } else {
      availableCells.push(`${columnIndex[i]}${pieceLocation.row + 1}`);
    }
  }

  // from rook to right
  for (let i = pieceLocation.column + 1; i <= 7; i++) {
    if (altBoard[i][pieceLocation.row].length === 1) {
      if (altBoard[i][pieceLocation.row][0].color !== rook.color) {
        canTakePiece.push(`${columnIndex[i]}${pieceLocation.row + 1}`);

        break;
      } else {
        break;
      }
    } else {
      availableCells.push(`${columnIndex[i]}${pieceLocation.row + 1}`);
    }
  }
}
function knightMove(knight, pieceLocation, altBoard) {
  let col, row;

  const moveKnight = function () {
    let knightsCell;
    if (col >= 0 && row >= 0 && col <= 7 && row <= 7) {
      knightsCell = altBoard[col][row];
    } else {
      return;
    }
    // check if this cell exists
    if (knightsCell) {
      if (knightsCell.length === 1) {
        if (knightsCell[0].color !== knight.color) {
          canTakePiece.push(`${columnIndex[col]}${row + 1}`);
        }
      } else {
        availableCells.push(`${columnIndex[col]}${row + 1}`);
      }
    }
  };
  // top-right area
  col = pieceLocation.column + 2;
  row = pieceLocation.row + 1;

  moveKnight();

  col = pieceLocation.column + 1;
  row = pieceLocation.row + 2;

  moveKnight();

  // top-left area

  col = pieceLocation.column + 2;
  row = pieceLocation.row - 1;

  moveKnight();

  col = pieceLocation.column + 1;
  row = pieceLocation.row - 2;

  moveKnight();

  // bottom-right area

  col = pieceLocation.column - 2;
  row = pieceLocation.row - 1;

  moveKnight();

  col = pieceLocation.column - 1;
  row = pieceLocation.row - 2;

  moveKnight();

  // bottom-left area

  col = pieceLocation.column - 2;
  row = pieceLocation.row + 1;

  moveKnight();

  col = pieceLocation.column - 1;
  row = pieceLocation.row + 2;

  moveKnight();
}
function kingMove(king, pieceLocation, altBoard) {
  let col, row;

  row = pieceLocation.row;
  col = pieceLocation.column;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // check if this element exists
      const element = altBoard[col + i][row + j];
      if (element) {
        // skip when cell with this king
        if (element.length === 1 && element[0].id === king.id) {
          continue;
        } else if (element.length === 1) {
          if (element[0].color !== king.color) {
            canTakePiece.push(`${columnIndex[col + i]}${row + j + 1}`);
          } else {
            continue;
          }
        } else {
          availableCells.push(`${columnIndex[col + i]}${row + j + 1}`);
        }
      }
    }
  }
}
function bishopMove(bishop, pieceLocation, altBoard) {
  let col, row;
  // from bishop to top right corner
  col = pieceLocation.column + 1;
  row = pieceLocation.row + 1;

  while (col <= 7 && row <= 7) {
    if (altBoard[col][row][0]) {
      if (altBoard[col][row][0].color !== bishop.color) {
        canTakePiece.push(`${columnIndex[col]}${row + 1}`);
        break;
      } else {
        break;
      }
    } else {
      availableCells.push(`${columnIndex[col]}${row + 1}`);
      col++;
      row++;
    }
  }

  // from bishop to top right corner
  col = pieceLocation.column + 1;
  row = pieceLocation.row - 1;

  while (col <= 7 && row >= 0) {
    if (altBoard[col][row][0]) {
      if (altBoard[col][row][0].color !== bishop.color) {
        canTakePiece.push(`${columnIndex[col]}${row + 1}`);
        break;
      } else {
        break;
      }
    } else {
      availableCells.push(`${columnIndex[col]}${row + 1}`);
      col++;
      row--;
    }
  }

  // from bishop to bottom left corner
  col = pieceLocation.column - 1;
  row = pieceLocation.row - 1;

  while (col >= 0 && row >= 0) {
    if (altBoard[col][row][0]) {
      if (altBoard[col][row][0].color !== bishop.color) {
        canTakePiece.push(`${columnIndex[col]}${row + 1}`);
        break;
      } else {
        break;
      }
    } else {
      availableCells.push(`${columnIndex[col]}${row + 1}`);
      col--;
      row--;
    }
  }

  // from bishop to bottom right corner
  col = pieceLocation.column - 1;
  row = pieceLocation.row + 1;

  while (col >= 0 && row <= 7) {
    if (altBoard[col][row][0]) {
      if (altBoard[col][row][0].color !== bishop.color) {
        canTakePiece.push(`${columnIndex[col]}${row + 1}`);
        break;
      } else {
        break;
      }
    } else {
      availableCells.push(`${columnIndex[col]}${row + 1}`);
      col--;
      row++;
    }
  }
}
function pawnMove(pawn, pieceLocation, altBoard) {
  //set direction for pawn and check wheter it's first pawn's move
  let direction;
  if (pawn.color === 'white') {
    direction = 1;
  } else {
    direction = -1;
  }

  // function to check if the corner exists
  let isCellExists = function (i) {
    if (
      pieceLocation.column + i >= 0 &&
      pieceLocation.column + i <= 7 &&
      pieceLocation.row + direction >= 0 &&
      pieceLocation.row + direction <= 7
    ) {
      return true;
    } else {
      return false;
    }
  };
  //check top corners for whites or bottom corners for blacks (take piece)
  for (let i = -1; i <= 1; i++) {
    // if i = 0 then it will check cell above, what we don't want
    if (i === 0) {
      continue;
    }

    if (
      isCellExists(i) &&
      altBoard[pieceLocation.column + i][pieceLocation.row + direction].length === 1 &&
      altBoard[pieceLocation.column + i][pieceLocation.row + direction][0].color !== pawn.color
    ) {
      const cellId = `${columnIndex[pieceLocation.column + i]}${pieceLocation.row + direction + 1}`;
      canTakePiece.push(cellId);
    }
  }

  // if next cell contains piece => can't move
  isCellExists = function () {
    if (
      pieceLocation.row + direction >= 0 &&
      pieceLocation.row + direction <= 7 &&
      altBoard[pieceLocation.column][pieceLocation.row + direction].length === 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  if (isCellExists()) {
    availableCells.push(`${columnIndex[pieceLocation.column]}${pieceLocation.row + direction + 1}`);

    if (pawn.isFirstMove) {
      direction *= 2;
      if (isCellExists()) {
        availableCells.push(`${columnIndex[pieceLocation.column]}${pieceLocation.row + direction + 1}`);
      }
    }
  }
}

class ChessPiece {
  name;
  color;
  id;
  isFirstMove;
  move() {
    const pieceElement = document.getElementById(this.id);
    const pieceLocation = {
      column: columnIndex.findIndex((element) => element === pieceElement.parentElement.id[0]),
      row: +pieceElement.parentElement.id[1] - 1,
    };

    // creating alternative board
    const altBoard = [];
    for (let i = 0; i < 8; i++) {
      altBoard.push([]);
      for (let j = 0; j < 8; j++) {
        altBoard[i].push([]);
      }
    }

    document.querySelectorAll('.piece').forEach((piece) => {
      const column = columnIndex.findIndex((element) => element === piece.parentElement.id[0]);
      const row = +piece.parentElement.id[1] - 1;

      const pieceName = piece.getAttribute('name');
      const pieceColor = piece.dataset.color;
      const pieceId = piece.id;
      const pieceIsFirstMove = piece.isFirstMove;

      altBoard[column][row].push(new ChessPiece(pieceName, pieceColor, pieceId, pieceIsFirstMove));
    });
    //-----------------------

    switch (this.name) {
      case 'king':
        // movement
        kingMove(this, pieceLocation, altBoard);

        break;

      case 'queen':
        // queen's movement = bishop + rook
        bishopMove(this, pieceLocation, altBoard);
        rookMove(this, pieceLocation, altBoard);

        break;

      case 'bishop':
        bishopMove(this, pieceLocation, altBoard);

        break;

      case 'knight':
        knightMove(this, pieceLocation, altBoard);

        break;

      case 'rook':
        rookMove(this, pieceLocation, altBoard);

        break;

      case 'pawn':
        pawnMove(this, pieceLocation, altBoard);

        break;
    }

    return {
      availableCells,
      canTakePiece,
    };
  }
  constructor(name, color, id, isFirstMove) {
    this.name = name;
    this.color = color;
    this.id = id;
    this.isFirstMove = isFirstMove;
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
  }
}

// function to show availible cells to move and function which removes them
function addAvailableCells(pieceObj) {
  pieceObj.move();
  // remove invalid cells from arrays
  isValidMove();
  const availableCellsPrototype = availableCells.filter((value, index) => availableCells.indexOf(value) === index);
  const canTakePiecePrototype = canTakePiece.filter((value, index) => canTakePiece.indexOf(value) === index);

  availableCellsPrototype.forEach((cell) => {
    const availableCell = document.createElement('div');
    availableCell.className = 'cell__availible';
    document.getElementById(cell).appendChild(availableCell);
  });

  canTakePiecePrototype.forEach((cell) => {
    const takenCell = document.createElement('div');
    takenCell.className = 'cell__can-take';
    document.getElementById(cell).appendChild(takenCell);
  });

  availableCells.length = 0;
  canTakePiece.length = 0;
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
  availableCells.length = 0;
  canTakePiece.length = 0;
}

// add piece on board
let id = 1;
pieces.forEach((piece) => {
  Object.entries(piece.startingCell).forEach(([color, cell]) => {
    cell.forEach((cell) => {
      const pieceId = `piece${id}`;
      const pieceHTML = `
        <div class="piece" id="${pieceId}" name="${piece.name}" data-color="${color}" data-is-first-move="true">
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
          pieceId,
          true
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

    function replaceChess() {
      // we can't take kings so we check is this cell have king or not
      if (cell.contains(cell.querySelector('.piece')) && cell.querySelector('.piece').getAttribute('name') === 'king') {
        return;
      }

      const html = document.getElementById(activePieceId).cloneNode(true);
      html.removeAttribute('data-is-first-move');
      cell.innerHTML = '';
      document.getElementById(activePieceId).remove();
      cell.appendChild(html);

      document.getElementById(html.id).addEventListener('click', () => {
        const chessPiece = new ChessPiece(
          document.getElementById(html.id).getAttribute('name'),
          document.getElementById(html.id).dataset.color,
          html.id,
          false
        );

        pieceFun(chessPiece);
      });

      // remove previous check or adding new check for ENEMY king
      if (document.querySelector('.piece__check')) {
        document.querySelectorAll('.piece__check').forEach((mark) => {
          mark.remove();
        });
      }

      if (isCheck(activeSide() === 'white' ? 'black' : 'white')) {
        const kingId = activeSide() === 'white' ? 'piece2' : 'piece1';
        const checkMark = document.createElement('div');
        checkMark.className = 'piece__check';

        document.getElementById(kingId).parentElement.appendChild(checkMark);
      }

      // remove an active mark
      removeAvailableCells();
      document.querySelector('.piece__active').remove();

      isPieceActive = false;
      activePieceId = null;
      currentTurn++;
    }

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
