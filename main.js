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

let interactions = [];
let interactionLoop = setInterval(playInteraction, 20);


play("E2", "E4");
play("E7", "E5");

play("D1", "G4");
play("G7", "G5");

play("G4", "F4");
play("E5", "F4");

play("D2", "D3");
play("D8", "F6");

play("C1", "D2");
play("F6", "D4");

play("D2", "B4");
play("D4", "C3");


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

		for (let i=game.moves.length-1; i>=0; i--) {
			
			let piece = game.moves[i];
			let vetted = Piece.vetMoveForChecks(game.grid, game.selectedPiece, piece, false);
			if (!vetted) {
				//console.log("REMOVED" + piece.rowColumnToString());
				game.moves.splice(i, 1);
			}
			else piece.highlight();
		}

		for (let i=game.captures.length-1; i>=0; i--) {
			
			let piece = game.captures[i];
			let vetted = Piece.vetMoveForChecks(game.grid, game.selectedPiece, piece, true);
			if (!vetted) {
				//console.log("REMOVED" + piece.rowColumnToString());
				game.captures.splice(i, 1);
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

function play(string1, string2) {
	interactions.push(function() { selectPiece(stringToPiece(game.grid, string1)) });
	interactions.push(function() { selectPiece(stringToPiece(game.grid, string2)) });
}

function stringToPiece(board, string) {
	let char1 = string.substring(0, 1).toLowerCase();
	let char2 = string.substring(1, 2);

	let rows = ["a","b","c","d","e","f","g","h"];

	return board[8 - char2][rows.indexOf(char1)];
}

function playInteraction() {
	if (interactions.length <= 0) return;

	let func = interactions.shift();
	func();
}

function listout(list) {
	for (let p of list) {
		console.log(p.rowColumnToString(), p.type);
	}
}