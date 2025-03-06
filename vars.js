let selectedPiece = null;
let selectedMoves = [];
let selectedCaptures = [];
let grid = [];

function selectPiece(piece) {

	//cannot select empty piece
	if (selectedPiece == null && piece.constructor.name == "EmptyPiece") return;

	//deselect current piece
	if (piece == selectedPiece) {

		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightCaptures();
		return;
	}

	//select friendly piece
	if (piece != null && (selectedPiece === null || selectedPiece.side == piece.side)) {

		dehighlightSelectedMoves();

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

		let tempRow = selectedPiece.row;
		let tempColumn = selectedPiece.column;

		let tempRow2 = piece.row;
		let tempColumn2 = piece.column;

		selectedPiece.setPosition(tempRow2, tempColumn2);
		grid[tempRow2][tempColumn2] = selectedPiece;

		piece.setPosition(tempRow, tempColumn);
		grid[tempRow][tempColumn] = piece;

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