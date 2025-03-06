class EmptyPiece extends Piece {
	constructor(row, column, side, theoretical=false) {
		super(row, column, side, theoretical);
	}

	makeTheoreticalCopy() {
		return new EmptyPiece(this.row, this.column, this.side, true);
	}
}