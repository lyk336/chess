import { pieces } from './data/pieces.js';

const board = document.getElementById('board');
const columns = document.querySelectorAll('.board__column');
const columnIndex = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

class ChessPiece {
  name;
  color;
  id;
  move() {
    switch (this.name) {
    }
  }
  constructor(name, color, id) {
    this.name = name;
    this.color = color;
    this.id = id;
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
      document.querySelector('.piece__active').remove();

      isPieceActive = false;
      activePieceId = '';
    } else {
      activePieceId = pieceObj.id;
      // add an active mark

      const activePieceHtml = document.createElement('div');
      activePieceHtml.className = 'piece__active';
      document.getElementById(pieceObj.id).parentElement.appendChild(activePieceHtml);
    }
    console.log(`${pieceObj.name} on ${document.getElementById(pieceObj.id).parentElement.id}`, isPieceActive, activePieceId);
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

        pieceFun(chessPiece);
      });

      // remove an active mark
      document.querySelector('.piece__active').remove();

      isPieceActive = false;
      activePieceId = null;
      currentTurn++;
    };

    // permission to move only when one of the pieces was chosen
    if (isPieceActive) {
      // console.log('move', pieceId);
      // checking if this cell contains piece
      if (cell.contains(cell.querySelector('.piece'))) {
        pieceId = cell.querySelector('.piece').id;

        // if piece move on opponent's piece, it eat(replaces) it
        if (document.getElementById(pieceId).dataset.color !== activeSide()) {
          console.log('you eat this piece');
          replaceChess();
        }
      } else {
        pieceId = null;
        replaceChess();
      }
    }
  });
});
