//
let game = {
	playerTurn: "white",
	selectedPiece: null,
	moves: [],
	captures: [],
	grid: [],
	lastMove: []
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

	let currentPieceExists = game.selectedPiece !== null;
	let pieceExists = piece !== null;

	//cannot select null
	if (!pieceExists) return;

	let pieceIsSameAsCurrentPiece = piece == game.selectedPiece;
	let pieceIsFriendly = piece.side == game.playerTurn;
	let isMove = game.moves.includes(piece);
	let isCapture = game.captures.includes(piece);

	//cannot select unfriendly piece
	if (!currentPieceExists && !pieceIsFriendly) return;

	//deselect
	if (pieceIsSameAsCurrentPiece || (currentPieceExists && !pieceIsFriendly && !isMove && !isCapture)) {

		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();
		return;
	}

	//select friendly piece
	if (pieceIsFriendly) {

		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();

		game.selectedPiece = piece;
		game.selectedPiece.highlight();

		game.moves = game.selectedPiece.getPossibleMoves(game.grid);
		game.captures = game.selectedPiece.getPossibleCaptures(game.grid, game.lastMove);

		for (let piece of game.moves) {
			
			let vetted = Piece.vetMoveForChecks(game.grid, game.selectedPiece, piece, isCapture);
			if (!vetted) {
				game.moves.splice(game.moves.indexOf(piece), 1);
			}
			else piece.highlight();
		}

		for (let piece of game.captures) {
			
			let vetted = Piece.vetMoveForChecks(game.grid, game.selectedPiece, piece, isCapture);
			if (!vetted) {
				game.captures.splice(game.captures.indexOf(piece), 1);
			}
			else piece.highlight();
		}
		return;
	}
	
	// move/capture
	if (currentPieceExists && (isMove || isCapture)) {
		dehighlightSelectedMoves();
		
		Piece.isInCheck(game.grid, game.playerTurn);

		game.lastMove = Piece.makeMove(game.grid, game.selectedPiece, piece, isCapture);

		//deselect
		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();
		game.playerTurn = Piece.opposite(game.playerTurn);
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

function printBoard(board) {
	for (let r=0; r<8; r++) {
		let str = "r" + r + "[ ";
		for (let c=0; c<8; c++) {
			str += board[r][c].constructor.name.substring(0, 2) + " ";
		}
	
		console.log(str+"]");
	}
}