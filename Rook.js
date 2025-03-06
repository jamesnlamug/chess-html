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
		}

		return possibleMoves;
	}

	getPossibleMovesDirection(board, rowOffset, columnOffset) {
		
		let possibleMoves = [];

		let currentPiece = this;
		let nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		while(nextPiece != null && nextPiece.constructor.name == "EmptyPiece") {

			possibleMoves.push(nextPiece);
			currentPiece = nextPiece;
			nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		}
		return possibleMoves;

	}

	getPossibleCaptures(board, lastMove="") {
		let possibleCaptures = [];

		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board, -1, 0));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board, 1, 0));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board, 0, -1));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board, 0, 1));

		return possibleCaptures;
	}

	getPossibleCaptureDirection(board, rowOffset, columnOffset) {
		
		let currentPiece = this;
		let nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		while(nextPiece !== null && nextPiece.constructor.name == "EmptyPiece") {

			currentPiece = nextPiece;
			nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		}

		if (nextPiece !== null && nextPiece.side == Piece.opposite(this.side)) return [nextPiece];
		return [];

	}
}