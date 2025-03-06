class Rook extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
		this.element.innerHTML = "This is a Rook";
		this.movedBefore = false;
	}

	getPossibleMoves(board) {
		let possibleMoves = [];
		
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, -1, 0));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 1, 0));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 0, -1));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 0, 1));

		return possibleMoves;
	}

	getPossibleMovesDirection(board, rowOffset, columnOffset) {
		
		let possibleMoves = [];

		let currentPiece = this;
		let nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		while(nextPiece !== null && nextPiece.constructor.name == "EmptyPiece") {

			possibleMoves.push(nextPiece);
			currentPiece = nextPiece;
			nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		}
		return possibleMoves;

	}

	getPossibleCaptures(board, lastMove="", kingDanger = false) {
		let possibleCaptures = [];

		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board, -1,  0, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board,  1,  0, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board,  0, -1, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board,  0,  1, kingDanger));

		return possibleCaptures;
	}

	getPossibleCaptureDirection(board, rowOffset, columnOffset, kingDanger) {
		
		let currentPiece = this;
		let nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		while(nextPiece !== null && (kingDanger || nextPiece.constructor.name == "EmptyPiece")) {

			currentPiece = nextPiece;
			nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		}

		if (nextPiece !== null && nextPiece.side == Piece.opposite(this.side)) return [nextPiece];
		return [];

	}
}