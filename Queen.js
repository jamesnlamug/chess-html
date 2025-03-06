class Queen extends Piece {
	constructor(row, column, side, theoretical = false) {
		super(row, column, side, theoretical);
	}

	getPossibleMoves(board) {
		let possibleMoves = [];
		
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, -1, 0));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 1, 0));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 0, -1));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 0, 1));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, -1, -1));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, -1, 1));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 1, -1));
		possibleMoves = possibleMoves.concat(this.getPossibleMovesDirection(board, 1, 1));
		
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
		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board, -1, -1, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board, -1,  1, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board,  1, -1, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCaptureDirection(board,  1,  1, kingDanger));

		return possibleCaptures;
	}

	getPossibleCaptureDirection(board, rowOffset, columnOffset, kingDanger) {
		
		let currentPiece = this;
		let nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);

		while(nextPiece !== null && (nextPiece.constructor.name == "EmptyPiece")) {

			currentPiece = nextPiece;
			nextPiece = Piece.direction(board, currentPiece, rowOffset, columnOffset);
		}

		if (nextPiece === null || (nextPiece.side == this.side && !kingDanger)) return [];
		return [nextPiece];

	}

	makeTheoreticalCopy() {
		return new Queen(this.row, this.column, this.side, true);
	}
}