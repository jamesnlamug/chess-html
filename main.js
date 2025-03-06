//
let selectedPiece = null;
let selectedMoves = [];
let selectedCaptures = [];
let grid = [];


for (let r=0; r<8; r++) {
	let arr = [];
	for (let c=0; c<8; c++) {
		arr.push(null);
	}

	grid.push(arr);
}

putPieces();
for (let r=0; r<8; r++) {
	for (let c=0; c<8; c++) {
		if (grid[r][c] === null) grid[r][c] = new EmptyPiece(r, c, "none");
		grid[r][c].nameSelf();
	}
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

//
//
//

function selectPiece(piece) {

	//cannot select empty piece
	if (selectedPiece == null && piece.constructor.name == "EmptyPiece") return;

	//deselect current piece
	if (piece == selectedPiece || (selectedPiece !== null && piece.side == Piece.opposite(selectedPiece.side) && !selectedCaptures.includes(piece))) {

		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();
		return;
	}

	//select friendly piece
	if (piece != null && (selectedPiece === null || selectedPiece.side == piece.side)) {

		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();

		selectedPiece = piece;
		selectedPiece.highlight();

		selectedMoves = selectedPiece.getPossibleMoves(grid);
		selectedCaptures = selectedPiece.getPossibleCaptures(grid);

		for (let piece of selectedMoves.concat(selectedCaptures)) {
			piece.highlight();
		}
		return;
	}

	//move to space
	if (selectedPiece !== null && selectedMoves.includes(piece)) {
		dehighlightSelectedMoves();

		Piece.makeMove(grid, selectedPiece, piece);

		//deselect
		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();
		return;
	}

	//capture piece
	if (selectedPiece !== null && selectedCaptures.includes(piece)) {
		dehighlightSelectedCaptures();

		let tempRow = selectedPiece.row;
		let tempColumn = selectedPiece.column;

		let tempRow2 = piece.row;
		let tempColumn2 = piece.column;

		selectedPiece.setPosition(tempRow2, tempColumn2);
		grid[tempRow2][tempColumn2] = selectedPiece;

		piece.element.remove();
		grid[tempRow][tempColumn] = new EmptyPiece(tempRow, tempColumn, "none");

		//deselect
		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();
		return;
	}

}

function dehighlightSelectedPiece() {
	if (selectedPiece != null) selectedPiece.highlight(true);
	selectedPiece = null;
}

function dehighlightSelectedMoves() {
	for (let piece of selectedMoves) {
		piece.highlight(true);
	}

	selectedMoves = [];
}

function dehighlightSelectedCaptures() {
	for (let piece of selectedCaptures) {
		piece.highlight(true);
	}

	selectedCaptures = [];
}

function printGrid() {
	for (let r=0; r<8; r++) {
		let str = "[] ";
		for (let c=0; c<8; c++) {
			str += grid[r][c].constructor.name + " ";

			for (let i=0; i< (10 - grid[r][c].constructor.name); i++) {
				str+= " ";
			}
		}
	
		console.log(str+"]");
	}
}