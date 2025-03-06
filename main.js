//
let game = {
	playerTurn: "white",
	selectedPiece: null,
	moves: [],
	captures: [],
	grid: []
};


for (let r=0; r<8; r++) {
	let arr = [];
	for (let c=0; c<8; c++) {
		arr.push(null);
	}

	game.grid.push(arr);
}

putPieces();
for (let r=0; r<8; r++) {
	for (let c=0; c<8; c++) {
		if (game.grid[r][c] === null) game.grid[r][c] = new EmptyPiece(r, c, "none");
		game.grid[r][c].nameSelf();
	}
}

function putPieces() {

	putPieceRow(0, "black");
	putPawnRow(1, "black");

	putPieceRow(7, "white");
	putPawnRow(6, "white");
	
}

function putPieceRow(row, side) {
	game.grid[row][0] = new Rook(row, 0, side);
	game.grid[row][1] = new Knight(row, 1, side);
	game.grid[row][2] = new Bishop(row, 2, side);
	game.grid[row][3] = new Queen(row, 3, side);
	game.grid[row][4] = new King(row, 4, side);
	game.grid[row][5] = new Bishop(row, 5, side);
	game.grid[row][6] = new Knight(row, 6, side);
	game.grid[row][7] = new Rook(row, 7, side);

}

function putPawnRow(row, side) {
	for (let i=0; i<8; i++) {
		game.grid[row][i] = new Pawn(row, i, side);
	}
}

//
//
//

function selectPiece(piece) {

	//cannot select empty piece
	if (game.selectedPiece == null && piece.constructor.name == "EmptyPiece") return;

	//deselect current piece
	if (piece == game.selectedPiece || (game.selectedPiece !== null && piece.side == Piece.opposite(game.selectedPiece.side) && !game.captures.includes(piece))) {

		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();
		return;
	}

	//select friendly piece
	if (piece != null && (game.selectedPiece === null || game.selectedPiece.side == piece.side)) {

		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();

		game.selectedPiece = piece;
		game.selectedPiece.highlight();

		game.moves = game.selectedPiece.getPossibleMoves(game.grid);
		game.captures = game.selectedPiece.getPossibleCaptures(game.grid);

		for (let piece of game.moves.concat(game.captures)) {
			piece.highlight();
		}
		return;
	}

	//move to space
	if (game.selectedPiece !== null && game.moves.includes(piece)) {
		dehighlightSelectedMoves();

		Piece.makeMove(game.grid, game.selectedPiece, piece);

		//deselect
		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();
		return;
	}

	//capture piece
	if (game.selectedPiece !== null && game.captures.includes(piece)) {
		dehighlightSelectedCaptures();

		let tempRow = game.selectedPiece.row;
		let tempColumn = game.selectedPiece.column;

		let tempRow2 = piece.row;
		let tempColumn2 = piece.column;

		game.selectedPiece.setPosition(tempRow2, tempColumn2);
		game.grid[tempRow2][tempColumn2] = game.selectedPiece;

		piece.element.remove();
		game.grid[tempRow][tempColumn] = new EmptyPiece(tempRow, tempColumn, "none");

		//deselect
		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();
		return;
	}

}

function dehighlightSelectedPiece() {
	if (game.selectedPiece != null) game.selectedPiece.highlight(true);
	game.selectedPiece = null;
}

function dehighlightSelectedMoves() {
	for (let piece of game.moves) {
		piece.highlight(true);
	}

	game.moves = [];
}

function dehighlightSelectedCaptures() {
	for (let piece of game.captures) {
		piece.highlight(true);
	}

	game.captures = [];
}

function printGrid() {
	for (let r=0; r<8; r++) {
		let str = "[] ";
		for (let c=0; c<8; c++) {
			str += game.grid[r][c].constructor.name + " ";

			for (let i=0; i< (10 - game.grid[r][c].constructor.name); i++) {
				str+= " ";
			}
		}
	
		console.log(str+"]");
	}
}