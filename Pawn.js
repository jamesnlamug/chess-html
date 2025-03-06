class Pawn extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
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

	getPossibleCaptures(board, lastMove=[], kingDanger = false) {
		let possibleCaptures = [];
		let direction = this.side == "white" ? -1 : 1;

		if (Piece.direction(board, this, direction, -1) !== null && (kingDanger || this.canEnpassant(board, lastMove, -1) || Piece.direction(board, this, direction, -1).side == Piece.opposite(this.side))) possibleCaptures.push(Piece.direction(board, this, direction, -1));
		if (Piece.direction(board, this, direction, 1) !== null && (kingDanger || this.canEnpassant(board, lastMove, 1) || Piece.direction(board, this, direction, 1).side == Piece.opposite(this.side))) possibleCaptures.push(Piece.direction(board, this, direction, 1));

		return possibleCaptures;
	}

	forward(board, piece) {
		let direction = this.side == "white" ? -1 : 1;
		return board[piece.row+direction][piece.column];
	}

	canEnpassant(board, lastMove, columnOffset) {
		if (lastMove.length == 0) return false;

		let piece = Piece.direction(board, this, 0, columnOffset);
		
		let isAPiece = piece !== null;
		if (!isAPiece) return false;

		let isAPawn = piece.constructor.name == "Pawn";
		let justMoved = lastMove[0] == piece;
		let movedFromStartingRank = lastMove[1].row == 1 || lastMove[1].row == 6;

		console.log(lastMove, piece);
		console.log(isAPawn , justMoved , movedFromStartingRank);
		return isAPawn && justMoved && movedFromStartingRank;
	}
}