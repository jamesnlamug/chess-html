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

		console.log(dehighlight + ", " + this.row + ", " + this.column);
	}

	static direction(board, piece, rowOffset, columnOffset) {
		let newRow = piece.row + rowOffset;
		let newColumn = piece.column + columnOffset;

		if (newRow < 0 || newColumn < 0 || newRow >= board.length || newColumn >= board[0].length) return null;

		console.log(newRow + ", " + newColumn);
		console.log(board[newRow][newColumn].constructor.name);

		return board[newRow][newColumn];
	}

	static opposite(side) {
		return side=="white" ? "black" : "white";
	}
}