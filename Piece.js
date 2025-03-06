const chessboard = document.getElementById("chess-board");
const tileSize = 128;
const tileMargin = 8;
const tilePadding = 4;
const leftOffset = 128;
const topOffset = 128;

class Piece {

	constructor(row, column, side, theoretical=false) {
		
		this.id = column + 1 + (row)*8;
		this.type = this.constructor.name;
		this.side = side;
		this.movedBefore = false;
		this.theoretical = theoretical;

		if (!theoretical) {
			this.element = document.createElement("button");
			this.element.classList.add("chess-piece");

			this.parent = document.createElement("div");
			this.parent.classList.add("chess-div");

			if(this.side !== "none") {
				this.element.classList.add(side + "-piece");
				this.element.style.backgroundImage = "url(\"chess-piece-images/" + this.side + "-" + this.type.toLowerCase() + ".png\")";
			}

			this.parent.appendChild(this.element);
			chessboard.appendChild(this.parent);

			let piece = this;
			let selectThisPiece = function() {
				selectPiece(piece);
			}

			this.setPosition(row, column);
			this.element.addEventListener("click", selectThisPiece);
			//this.element.innerHTML = this.rowColumnToString();

			return;
		}

		this.setPosition(row, column);
	}

	setPosition(row, column) {
		this.row = row;
		this.column = column;
		if (this.theoretical) return;
		this.parent.style.left = (column * (tileSize + tileMargin) + leftOffset) +"px";
		this.parent.style.top = (row * (tileSize + tileMargin) + topOffset) +"px";

		this.element.style.left = (tilePadding/2) +"px";
		this.element.style.top = (tilePadding/2) +"px";
	}

	highlight(dehighlight = false) {
		if (dehighlight) this.parent.classList.remove("highlighted-div");
		else this.parent.classList.add("highlighted-div");
	}

	static direction(board, piece, rowOffset, columnOffset) {
		let newRow = piece.row + rowOffset;
		let newColumn = piece.column + columnOffset;

		if (newRow < 0 || newColumn < 0 || newRow >= board.length || newColumn >= board[0].length) return null;

		return board[newRow][newColumn];
	}

	static opposite(side) {
		return side=="white" ? "black" : "white";
	}

	static makeMove(board, piece1, piece2, isCapture) {

		piece1.movedBefore = true;
		piece2.movedBefore = true;

		let tempRow = piece1.row;
		let tempColumn = piece1.column;

		let tempRow2 = piece2.row;
		let tempColumn2 = piece2.column;

		if (!isCapture) {
			piece2.setPosition(tempRow, tempColumn);
			board[tempRow][tempColumn] = piece2;
		}

		if (isCapture) {
			if (piece2.constructor.name == "EmptyPiece") {
				//en passant
				let enPassantedPawn = Piece.direction(board, piece1, 0, piece2.column - piece1.column);
				
				piece2 = Piece.makeMove(board, piece2, enPassantedPawn)[1];
			}
			piece2.element.remove();
			game.grid[tempRow][tempColumn] = new EmptyPiece(tempRow, tempColumn, "none");
		}

		piece1.setPosition(tempRow2, tempColumn2);
		board[tempRow2][tempColumn2] = piece1;

		if (piece1.constructor.name != "King") return [piece1, piece2];

		if (Math.abs(piece2.column - piece1.column) <= 1) return [piece1, piece2];

		let rookOffset = Math.sign(piece2.column - piece1.column);
		let rook = board[piece1.row][(rookOffset === 1 ? 0 : 7)];
		Piece.makeMove(board, rook, board[piece1.row][piece1.column + rookOffset]);
		
		return [piece1, piece2];

	}

	//returns true for safe moves
	static vetMoveForChecks(referenceBoard, referencePiece1, referencePiece2, isCapture) {

		//new board disconnected from reference
		let board = [];

		for (let r=0; r<8; r++) {
			let arr = [];
			for (let c=0; c<8; c++) {
				arr.push(referenceBoard[r][c].makeTheoreticalCopy());
			}
			board.push(arr);
		}

		let piece1 = board[referencePiece1.row][referencePiece1.column];
		let piece2 = board[referencePiece2.row][referencePiece2.column];

		piece1.movedBefore = true;
		piece2.movedBefore = true;

		let tempRow = piece1.row;
		let tempColumn = piece1.column;

		let tempRow2 = piece2.row;
		let tempColumn2 = piece2.column;

		if (!isCapture) {
			piece2.setPosition(tempRow, tempColumn);
			board[tempRow][tempColumn] = piece2;

		} else {
			if (piece2.constructor.name == "EmptyPiece") {
				//en passant
				let enPassantedPawn = Piece.direction(board, piece1, 0, piece2.column - piece1.column);
				
				piece2 = Piece.makeMove(board, piece2, enPassantedPawn)[1];
			}
			piece2.element.remove();
			game.grid[tempRow][tempColumn] = new EmptyPiece(tempRow, tempColumn, "none");
		}

		piece1.setPosition(tempRow2, tempColumn2);
		board[tempRow2][tempColumn2] = piece1;

		if (piece1.constructor.name == "King" && Math.abs(piece2.column - piece1.column) > 1) {

			let rookOffset = Math.sign(piece2.column - piece1.column);
			let rook = board[piece1.row][(rookOffset === 1 ? 0 : 7)];
			Piece.makeMove(board, rook, board[piece1.row][piece1.column + rookOffset]);
		}
		
		return !Piece.isInCheck(board, referencePiece1.side);
	}

	static isInCheck(board, side) {

		let king = Piece.findKing(board, side);
		let enemyPieces = Piece.findPieces(board, Piece.opposite(side));

		let attackersAndDangers = [];

		let allDangers = [];
		for (let piece of enemyPieces) {

			for (let d of piece.getPossibleCaptures(board, "", true)) {

				let ad = {
					attacker: piece,
					danger: d
				}

				allDangers.push(ad);
			}
		}

		for (let ad of allDangers) {
			if (ad.danger === null) continue;
			if (ad.danger.constructor.name == "EmptyPiece") continue;
			if (ad.danger != king) continue;

			attackersAndDangers.push(ad);
		}

		return attackersAndDangers.length > 0;
	}

	static findKing(board, side) {
		let king = null;

		for (let r=0; r<board.length; r++) {
			for (let c=0; c<board[0].length; c++) {
				if (board[r][c] === null) continue;
				if (board[r][c].side != side) continue;
				if (board[r][c].constructor.name != "King") continue;

				king = board[r][c];
				break;
			}

			if (king !== null) break;
		}

		return king;
	}

	static findPieces(board, side) {
		let pieces = [];

		for (let r=0; r<board.length; r++) {
			for (let c=0; c<board[0].length; c++) {
				if (board[r][c] === null) continue;
				if (board[r][c].side != side) continue;

				pieces.push(board[r][c]);
			}
		}

		return pieces;
	}

	nameSelf() {
		//if (this.constructor.name != "EmptyPiece") this.element.innerHTML = this.constructor.name;
	}

	print() {
		console.log(this.constructor.name, "with ID", this.id, "at", this.rowColumnToString());
	}

	rowColumnToString() {
		let string = "";

		switch (this.column) {
			case 0: string += "A"; break;
			case 1: string += "B"; break;
			case 2: string += "C"; break;
			case 3: string += "D"; break;
			case 4: string += "E"; break;
			case 5: string += "F"; break;
			case 6: string += "G"; break;
			case 7: string += "H"; break;
		}

		string += (8 - this.row);
		return string;
	}

}