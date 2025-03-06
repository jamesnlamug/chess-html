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

class Rook extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
		this.element.innerHTML = "This is a Rook";
	}

	getPossibleMoves(board) {
		let possibleMoves = [];
		
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, -1, 0));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 1, 0));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 0, -1));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 0, 1));

		for (let piece of possibleMoves) {
			piece.element.innerHTML = "possible" + piece.id;
			console.log(piece.element);
			console.log(piece.row + ", " + piece.column + " , possible");
		}

		return possibleMoves;
	}

	getPossibleMovesDirection(board, rowOffset, columnOffset) {
		
		let possibleMoves = [];

		let currentPiece = this;
		let nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		while(nextPiece != null && nextPiece.constructor.name == "EmptyPiece") {

			console.log("adding");


			possibleMoves.push(nextPiece);
			currentPiece = nextPiece;
			nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		}
		return possibleMoves;

	}
}

class Knight extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
		this.element.innerHTML = "This is a Knight";
	}
}

class Bishop extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
		this.element.innerHTML = "This is a Bishop";
	}
}

class Queen extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
		this.element.innerHTML = "This is a Queen";
	}
}

class King extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
		this.element.innerHTML = "This is a King";
	}
}

class Pawn extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
		this.element.innerHTML = "This is a Pawn";
	}

	getPossibleMoves(board) {
		let possibleMoves = [];
		let distance = (this.row == 6 && this.side == "white") || (this.row == 1 && this.side == "black") ? 2 : 1;
		let currentPiece = this;
		let nextPiece = this.forward(board, currentPiece);

		console.log(nextPiece.constructor.name);

		while(nextPiece.constructor.name == "EmptyPiece" && distance > 0) {
			possibleMoves.push(nextPiece);
			currentPiece = nextPiece;
			nextPiece = this.forward(board, currentPiece);
			distance --;

			console.log(currentPiece);
			console.log(nextPiece);
			console.log(distance);

		}

		return possibleMoves;
	}

	getPossibleCaptures(board, lastMove="") {
		let possibleCaptures = [];
		let direction = this.side == "white" ? -1 : 1;
		if (Piece.direction(board, this, -1, direction).side == Piece.opposite(this.side)) possibleCaptures.push(Piece.direction(board, this, -1, direction));
		if (Piece.direction(board, this, 1, direction).side == Piece.opposite(this.side)) possibleCaptures.push(Piece.direction(board, this, -1, direction));

		return possibleCaptures;
	}

	forward(board, piece) {
		let direction = this.side == "white" ? -1 : 1;
		return board[piece.row+direction][piece.column];
	}
}

class EmptyPiece extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
	}
}