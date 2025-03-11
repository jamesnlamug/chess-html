class Pawn extends Piece {
	constructor(row, column, side, theoretical = false) {
		super(row, column, side, theoretical);
	}

	getPossibleMoves(board) {
		let possibleMoves = [];
		let distance = (this.row == 6 && this.side == "white") || (this.row == 1 && this.side == "black") ? 2 : 1;
		let currentPiece = this;
		let nextPiece = board.getDirection(currentPiece, board.getForward(this), 0);
		
		while(nextPiece !== null && nextPiece.constructor.name == "EmptyPiece" && distance > 0) {
			possibleMoves.push(nextPiece);
			currentPiece = nextPiece;
			nextPiece = board.getDirection(currentPiece, board.getForward(this), 0);
			distance --;
		}

		return possibleMoves;
	}

	getPossibleCaptures(board, lastMove=[], kingDanger = false) {

		let possibleCaptures = [];
		let direction = this.side == "white" ? -1 : 1;

		if (board.getDirection(this, direction, -1) !== null && (kingDanger || this.canEnpassant(board, lastMove, -1) || board.getDirection(this, direction, -1).side == Piece.opposite(this.side))) possibleCaptures.push(board.getDirection(this, direction, -1));
		if (board.getDirection(this, direction,  1) !== null && (kingDanger || this.canEnpassant(board, lastMove,  1) || board.getDirection(this, direction,  1).side == Piece.opposite(this.side))) possibleCaptures.push(board.getDirection(this, direction, 1));

		return possibleCaptures;
	}

	canEnpassant(board, lastMove, columnOffset) {
		if (lastMove.length == 0) return false;

		let piece = board.getDirection(this, 0, columnOffset);
		
		let isAPiece = piece !== null;
		if (!isAPiece) return false;

		let isAPawn = piece.constructor.name == "Pawn";
		let justMoved = lastMove[0] == piece;
		let movedFromStartingRank = lastMove[1].row == 1 || lastMove[1].row == 6;

		return isAPawn && justMoved && movedFromStartingRank;
	}

	makeTheoreticalCopy() {
		return new Pawn(this.row, this.column, this.side, true);
	}
}