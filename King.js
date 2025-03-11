class King extends Piece {
	constructor(row, column, side, theoretical = false) {
		super(row, column, side, theoretical);
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

		possibleMoves = possibleMoves.concat(this.getPossibleCastling(board));
		
		return possibleMoves;
	}

	getPossibleMove(board, rowOffset, columnOffset) {
		let queriedPiece = board.getDirection(this, rowOffset, columnOffset);
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
		let queriedPiece = board.getDirection(this, rowOffset, columnOffset);
		if (queriedPiece !== null && queriedPiece.side == Piece.opposite(this.side)) return [queriedPiece];
		return [];
	}

	getPossibleCastling(board) {


		let possibleCastles = [];
		if (this.movedBefore || board.isInCheck(this.side) || (this.column != 4)) return [];

		let possibleDangers = this.getPossibleDangers(board);

		if (!board.getDirection(this, 0, 3).movedBefore
		&& board.getDirection(this, 0, 2).constructor.name == "EmptyPiece"
		&& board.getDirection(this, 0, 1).constructor.name == "EmptyPiece"
		&& !possibleDangers.includes(board.getDirection(this, 0, 2))
		&& !possibleDangers.includes(board.getDirection(this, 0, 1))
		) {
			possibleCastles.push(board.getDirection(this, 0, 2));
		}

		if (!board.getDirection(this, 0, -4).movedBefore
		&& board.getDirection(this, 0, -3).constructor.name == "EmptyPiece"
		&& board.getDirection(this, 0, -2).constructor.name == "EmptyPiece"
		&& board.getDirection(this, 0, -1).constructor.name == "EmptyPiece"
		&& !possibleDangers.includes(board.getDirection(this, 0, -2))
		&& !possibleDangers.includes(board.getDirection(this, 0, -1))
		) {
			possibleCastles.push(board.getDirection(this, 0, -2));
		}

		return possibleCastles;
	}

	getPossibleDangers(board) {

		let enemyPieces = [];
		let enemyKing = null;

		let count = 0;
		for (let r=0; r<board.getRowCount(); r++) {
			for (let c=0; c<board.getColumnCount(); c++) {
				count ++;
				if (board.get(r, c).side != Piece.opposite(this.side)) continue;
				if (board.get(r, c).constructor.name != "King") enemyPieces.push(board.get(r, c));
				else enemyKing = board.get(r, c);

				if (enemyKing !== null) break;
			}

			if (enemyKing !== null) break;
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

	makeTheoreticalCopy() {
		return new King(this.row, this.column, this.side, true);
	}
}