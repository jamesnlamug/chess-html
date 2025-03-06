const chessboard = document.getElementById("chess-board");
const tileSize = 64;
const tileMargin = 8;
const leftOffset = 128;
const topOffset = 128;

class Piece {

	constructor(row, column, side) {
		
		this.id = column + 1 + (row)*8;
		this.element = document.createElement("button");
		this.element.classList.add("chess-piece");
		this.movedBefore = false;
		
		this.side = side;
		if(this.side !== "none") this.element.classList.add(side + "-piece");

		chessboard.appendChild(this.element);

		this.setPosition(row, column);

		let piece = this;
		let selectThisPiece = function() {
			selectPiece(piece);
		}

		this.element.addEventListener("click", selectThisPiece);
		this.element.innerHTML = this.id;
	}

	setPosition(row, column) {
		this.row = row;
		this.column = column;

		this.element.style.left = (column * (tileSize + tileMargin) + leftOffset) +"px";
		this.element.style.top = (row * (tileSize + tileMargin) + topOffset) +"px";
	}

	highlight(dehighlight = false) {
		if (dehighlight) this.element.classList.remove("highlighted-piece");
		else this.element.classList.add("highlighted-piece");
	}

	static direction(board, piece, rowOffset, columnOffset) {
		let newRow = piece.row + rowOffset;
		let newColumn = piece.column + columnOffset;

		if (newRow < 0 || newColumn < 0 || newRow >= board.length || newColumn >= board[0].length) return null;

		return board[newRow][newColumn];
	}

	static opposite(side) {
		return side=="white" ? "black" : "white";
	}

	static makeMove(board, piece1, piece2, isCapture) {

		piece1.movedBefore = true;
		piece2.movedBefore = true;

		let tempRow = piece1.row;
		let tempColumn = piece1.column;

		let tempRow2 = piece2.row;
		let tempColumn2 = piece2.column;

		if (!isCapture) {
			piece2.setPosition(tempRow, tempColumn);
			board[tempRow][tempColumn] = piece2;
		}

		if (isCapture) {
			if (piece2.constructor.name == "EmptyPiece") {
				//en passant
				let enPassantedPawn = Piece.direction(board, piece1, 0, piece2.column - piece1.column);
				
				piece2 = Piece.makeMove(board, piece2, enPassantedPawn)[1];
			}
			piece2.element.remove();
			game.grid[tempRow][tempColumn] = new EmptyPiece(tempRow, tempColumn, "none");
		}

		piece1.setPosition(tempRow2, tempColumn2);
		board[tempRow2][tempColumn2] = piece1;

		if (piece1.constructor.name != "King") return [piece1, piece2];

		if (Math.abs(piece2.column - piece1.column) <= 1) return [piece1, piece2];

		let rookOffset = Math.sign(piece2.column - piece1.column);
		let rook = board[piece1.row][(rookOffset === 1 ? 0 : 7)];
		Piece.makeMove(board, rook, board[piece1.row][piece1.column + rookOffset]);
		
		return [piece1, piece2];

	}

	nameSelf() {
		if (this.constructor.name != "EmptyPiece") this.element.innerHTML = this.constructor.name;
	}
}