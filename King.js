class King extends Piece {
	constructor(row, column, side) {
		super(row, column, side);
		this.element.innerHTML = "This is a King";
		this.movedBefore = false;
	}

	getPossibleMoves(board) {
		let possibleMoves = [];
		let possibleDangers = this.getPossibleDangers(board);

		for (let rr=-1; rr<=1; rr++) {
			for (let cc=-1; cc<=1; cc++) {
				if (rr === 0 && cc === 0) continue;
				if (possibleDangers.includes(this.getPossibleMove(board, rr, cc)[0])) continue;

				possibleMoves = possibleMoves.concat(this.getPossibleMove(board, rr, cc));
			}
		}
		
		return possibleMoves;
	}

	getPossibleMove(board, rowOffset, columnOffset) {
		let queriedPiece = Piece.direction(board, this, rowOffset, columnOffset);
		if (queriedPiece !== null && queriedPiece.constructor.name == "EmptyPiece") return [queriedPiece];
		return [];
	}

	getPossibleCaptures(board, lastMove="") {
		let possibleCaptures = [];
		let possibleDangers = this.getPossibleDangers(board);

		for (let rr=-1; rr<=1; rr++) {
			for (let cc=-1; cc<=1; cc++) {
				if (rr === 0 && cc === 0) continue;
				if (possibleDangers.includes(this.getPossibleCapture(board, rr, cc)[0])) continue;

				possibleCaptures = possibleCaptures.concat(this.getPossibleCapture(board, rr, cc));
			}
		}

		return possibleCaptures;
	}

	getPossibleCapture(board, rowOffset, columnOffset) {
		let queriedPiece = Piece.direction(board, this, rowOffset, columnOffset);
		if (queriedPiece !== null && queriedPiece.side == Piece.opposite(this.side)) return [queriedPiece];
		return [];
	}

	/*getPossibleCastling(board) {
		let possibleDangers = this.getPossibleDangers(board);
		if (possibleDangers.includes(this.getPossibleCapture(board, rr, cc)[0])) continue;

		if ()


	}
*/
	getPossibleDangers(board) {

		let enemyPieces = [];
		let enemyKing;

		for (let r=0; r<board.length; r++) {
			for (let c=0; c<board[0].length; c++) {
				if (board[r][c].side != Piece.opposite(this.side)) continue;
				if (board[r][c].constructor.name != "King") enemyPieces.push(board[r][c]);
				else enemyKing = board[r][c];
			}
		}

		let possibleDangers = [];

		for (let enemyPiece of enemyPieces) {
			possibleDangers = possibleDangers.concat(enemyPiece.getPossibleCaptures(board, "", true));
			if(enemyPiece.constructor.name != "Pawn") possibleDangers = possibleDangers.concat(enemyPiece.getPossibleMoves(board, "", true));
		}

		//get enemy king moves(no infinite loop)
		for (let rr=-1; rr<=1; rr++) {
			for (let cc=-1; cc<=1; cc++) {
				if (rr === 0 && cc === 0) continue;

				possibleDangers = possibleDangers.concat(enemyKing.getPossibleMove(board, rr, cc));
			}
		}

		return possibleDangers;
	}
}