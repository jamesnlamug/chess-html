//

for (let r=0; r<8; r++) {
	let arr = [];
	for (let c=0; c<8; c++) {
		arr.push(null);
	}

	grid.push(arr);
}

function putPieces() {

	putPieceRow(0, "black");
	putPawnRow(1, "black");

	putPieceRow(7, "white");
	putPawnRow(6, "white");
	
}

function putPieceRow(row, side) {
	grid[row][0] = new Rook(row, 0, side);
	grid[row][1] = new Knight(row, 1, side);
	grid[row][2] = new Bishop(row, 2, side);
	grid[row][3] = new Queen(row, 3, side);
	grid[row][4] = new King(row, 4, side);
	grid[row][5] = new Bishop(row, 5, side);
	grid[row][6] = new Knight(row, 6, side);
	grid[row][7] = new Rook(row, 7, side);

}

function putPawnRow(row, side) {
	for (let i=0; i<8; i++) {
		grid[row][i] = new Pawn(row, i, side);
	}
}

putPieces();
for (let r=0; r<8; r++) {
	for (let c=0; c<8; c++) {
		if (grid[r][c] === null) grid[r][c] = new EmptyPiece(r, c, "none");
	}
}