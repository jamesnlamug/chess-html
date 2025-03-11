//
const uiWinner = document.getElementById("ui-checkmate");

let game;

//
//
//

setupTestCase(["KwH1", "RwB1", "RwA2", "KbH3"], "white", false);
console.log( runTestCase([
	["B1", "B3"],
	["H3", "H4"],

	["A2", "A4"],
	["H4", "H5"],
	
	["B3", "B5"],
	["H5", "H6"],
	
	["A4", "A6"],
	["H6", "H7"],
	
	["B5", "B7"],
	["H7", "H8"],
	
	["A6", "A8"]
]));

setupTestCase(["KwH1", "RwB1", "RwA2", "KbH3"], "white", false);
console.log( runTestCase([
	["B1", "B3"],
	["H3", "H4"],

	["A2", "A4"],
	["H4", "H5"],
	
	["B3", "B5"],
	["H5", "H6"],
	
	["A4", "A6"],
	["H6", "H7"],
	
	["B5", "B7"],
	["H7", "H8"],
	
	["A6", "G6"]
]));

setupTestCase([], "white", true);
console.log( runTestCase([
	["F2", "F3"],
	["E7", "E6"],

	["G2", "G4"],
	["D8", "H4"]
]));

setupTestCase([], "white", true);
console.log( runTestCase([
	["E2", "E4"],
	["E7", "E5"],

	["F1", "C4"],
	["F8", "C5"],

	["D1", "H5"],
	["B8", "C6"],

	["H5", "F7"]
]));

//
//
//

function setupTestCase(pieceCodes, turn="white", defaultSetup=true) {
	chessboard.innerHTML = "";

	if (defaultSetup) {
		game = new Game(turn, new Board());
	}
	else {
		game = new Game(turn, new Board(Board.nullGrid()));
	
		for (let pieceCode of pieceCodes) {
			let type = pieceCode.substring(0, 1);
			let side = pieceCode.substring(1, 2) == "w" ? "white" : "black";
			let position = pieceCode.substring(2, 4);

			game.board.place(type, side, position);
		}
	
		game.board.fillNullWithEmptyPieces();
	}

}

function runTestCase(positionMoveList) {
	let positionMove;
	for (let i=0; i<positionMoveList.length-1; i++) {
		positionMove = positionMoveList[i];
		tryMove(positionMove[0], positionMove[1]);
	}

	positionMove = positionMoveList[positionMoveList.length-1];
	return tryMove(positionMove[0], positionMove[1]);
}

function tryMove(position1, position2) {
	selectPiece(game.board.getByPosition(position1));
	return selectPiece(game.board.getByPosition(position2));
}

function selectPiece(piece) {

	let currentPieceExists = game.selectedPiece !== null;
	let pieceExists = piece !== null;

	//cannot select null
	if (!pieceExists) return "n";

	let pieceIsSameAsCurrentPiece = piece == game.selectedPiece;
	let pieceIsFriendly = piece.side == game.playerTurn;
	let isMove = game.moves.includes(piece);
	let isCapture = game.captures.includes(piece);

	//cannot select unfriendly piece
	if (!currentPieceExists && !pieceIsFriendly) return "n";

	//deselect
	if (pieceIsSameAsCurrentPiece || (currentPieceExists && !pieceIsFriendly && !isMove && !isCapture)) {

		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();
		return "n";
	}

	//select friendly piece
	if (pieceIsFriendly) {

		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();

		game.selectedPiece = piece;
		game.selectedPiece.highlight();

		game.moves = game.selectedPiece.getPossibleMoves(game.board);
		game.captures = game.selectedPiece.getPossibleCaptures(game.board, game.lastMove);

		for (let i=game.moves.length-1; i>=0; i--) {
			
			let piece = game.moves[i];
			let vetted = game.board.vetMoveForChecks(new Move(game.selectedPiece, piece, false));
			if (!vetted) {
				//console.log("REMOVED" + piece.rowColumnToString());
				game.moves.splice(i, 1);
			}
			else piece.highlight();
		}

		for (let i=game.captures.length-1; i>=0; i--) {
			
			let piece = game.captures[i];
			let vetted = game.board.vetMoveForChecks(new Move(game.selectedPiece, piece, true));
			if (!vetted) {
				//console.log("REMOVED" + piece.rowColumnToString());
				game.captures.splice(i, 1);
			}
			else piece.highlight();
		}
		return "n";
	}
	
	// move/capture
	if (currentPieceExists && (isMove || isCapture)) {
		dehighlightSelectedMoves();
		
		game.board.isInCheck(game.playerTurn);
		game.lastMove = game.board.makeMove(new Move(game.selectedPiece, piece, isCapture));

		//deselect
		dehighlightSelectedPiece();
		dehighlightSelectedMoves();
		dehighlightSelectedCaptures();
		game.playerTurn = Piece.opposite(game.playerTurn);

		if(game.board.checkForCheckmate(game.playerTurn)) {
			return endGame(Piece.opposite(game.playerTurn), game.board.isInCheck(game.playerTurn));
		}
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

function stringToPiece(board, string) {
	let char1 = string.substring(0, 1).toLowerCase();
	let char2 = string.substring(1, 2);

	let rows = ["a","b","c","d","e","f","g","h"];

	return board[8 - char2][rows.indexOf(char1)];
}

function listout(list) {
	for (let p of list) {
		console.log(p.rowColumnToString(), p.type);
	}
}

function endGame(winner, checkmate) {
	if (!checkmate) {
		uiWinner.innerHTML = "Draw - " + winner + " stalemated " + Piece.opposite(winner);
		return "1/2-1/2";
	}

	uiWinner.innerHTML = winner + " won!";
	return winner == "white" ? "1-0" : "0-1";
}