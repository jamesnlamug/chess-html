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

		while(nextPiece.constructor.name == "EmptyPiece" && distance > 0) {
			possibleMoves.push(nextPiece);
			currentPiece = nextPiece;
			nextPiece = this.forward(board, currentPiece);
			distance --;

		}

		return possibleMoves;
	}

	getPossibleCaptures(board, lastMove="") {
		let possibleCaptures = [];
		let direction = this.side == "white" ? -1 : 1;
		if (Piece.direction(board, this, direction, -1) !== null && Piece.direction(board, this, direction, -1).side == Piece.opposite(this.side)) possibleCaptures.push(Piece.direction(board, this, -1, -1));
		if (Piece.direction(board, this, direction, 1) !== null && Piece.direction(board, this, direction, 1).side == Piece.opposite(this.side)) possibleCaptures.push(Piece.direction(board, this, 1, 1));

		return possibleCaptures;
	}

	forward(board, piece) {
		let direction = this.side == "white" ? -1 : 1;
		return board[piece.row+direction][piece.column];
	}
}