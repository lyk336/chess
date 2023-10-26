import { pieces } from './data/pieces.js';

const board = document.getElementById('board');
const columns = document.querySelectorAll('.board__column');
const columnIndex = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// Find the required cell
function FindCell(cell) {
  this.column = columnIndex.findIndex((element) => element === cell[0]);
  this.row = +cell[1] - 1;
}
// find the required piece in HTML
function htmlFindPiece(element) {
  let row;

  const columnId = element.parentElement.parentElement.id;
  for (let i = 0; i < 8; i++) {
    const elem = document.getElementById(columnId).querySelectorAll('.board__cell')[i].querySelector('.piece');
    if (elem === element) {
      row = i;
    }
  }
  return columnId[7] + (8 - row);
}

// find the required cell in HTML
function htmlFindCell(element) {
  const columnId = element.parentElement.id;

  // suspicious function =)
  const getChildIndex = (node) => {
    return (Array.prototype.indexOf.call(node.parentNode.childNodes, node) - 1) / 2;
  };
  return columnId[7] + (8 - getChildIndex(element));
}

let isPieceActive = false;
let activePiece;

// add piece on board
let id = 1;
pieces.forEach((piece) => {
  Object.entries(piece.startingCell).forEach(([color, cell]) => {
    cell.forEach((cell) => {
      const pieceId = `piece${id}`;
      const pieceHTML = `<div class="piece black king" id="${pieceId}">
        <img src="img/pieces/${color}/${piece.name}.png" />
      </div>`;

      // adding on board
      const coordinates = new FindCell(cell);
      const requiredRow = columns[coordinates.column].querySelectorAll('.board__cell');

      requiredRow[7 - coordinates.row].innerHTML = pieceHTML;

      // adding event listener for clicking on piece
      document.getElementById(pieceId).addEventListener('click', () => {
        console.log(`${piece.name} on ${htmlFindPiece(document.getElementById(pieceId))}`);
        isPieceActive = true;
        activePiece = htmlFindPiece(document.getElementById(pieceId));
      });
      id++;
    });
  });
});

// add event listeners for all cells when the player selects a piece
board.querySelectorAll('.board__cell').forEach((cell) => {
  function eventListenerFun(event) {
    if (cell.querySelector('.piece')) {
    } else {
      if (isPieceActive) {
        console.log(`${activePiece} -> ${htmlFindCell(cell)}`);
        board.querySelectorAll('.board__cell').forEach((cll) => {
          cll.removeEventListener('click', eventListenerFun);
        });
      }
    }
  }
  cell.addEventListener('click', eventListenerFun);
});
function pawnMovement() {}
// creating rules of movement for all pieces;
