class Knight extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
		this.element.innerHTML = "This is a Knight";
	}

	getPossibleMoves(board) {
		let possibleMoves = [];
		
		possibleMoves = possibleMoves.concat(this.getPossibleMove(board, -2, -1));
		possibleMoves = possibleMoves.concat(this.getPossibleMove(board, -2,  1));
		possibleMoves = possibleMoves.concat(this.getPossibleMove(board,  2, -1));
		possibleMoves = possibleMoves.concat(this.getPossibleMove(board,  2,  1));
		possibleMoves = possibleMoves.concat(this.getPossibleMove(board, -1, -2));
		possibleMoves = possibleMoves.concat(this.getPossibleMove(board, -1,  2));
		possibleMoves = possibleMoves.concat(this.getPossibleMove(board,  1, -2));
		possibleMoves = possibleMoves.concat(this.getPossibleMove(board,  1,  2));
		
		return possibleMoves;
	}

	getPossibleMove(board, rowOffset, columnOffset) {
		let queriedPiece = Piece.direction(board, this, rowOffset, columnOffset);
		if (queriedPiece !== null && queriedPiece.constructor.name == "EmptyPiece") return [queriedPiece];
		return [];
	}

	getPossibleCaptures(board, lastMove="", kingDanger = false) {
		let possibleCaptures = [];

		possibleCaptures = possibleCaptures.concat(this.getPossibleCapture(board, -2, -1, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCapture(board, -2,  1, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCapture(board,  2, -1, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCapture(board,  2,  1, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCapture(board, -1, -2, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCapture(board, -1,  2, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCapture(board,  1, -2, kingDanger));
		possibleCaptures = possibleCaptures.concat(this.getPossibleCapture(board,  1,  2, kingDanger));

		return possibleCaptures;
	}

	getPossibleCapture(board, rowOffset, columnOffset, kingDanger) {
		let queriedPiece = Piece.direction(board, this, rowOffset, columnOffset);
		if (queriedPiece !== null && (kingDanger || queriedPiece.side == Piece.opposite(this.side))) return [queriedPiece];
		return [];
	}
}