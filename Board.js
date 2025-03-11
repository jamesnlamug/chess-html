class Board {
    
    constructor(grid = "default") {
        if (grid != "default") {
            this.grid = grid;
            return;
        }
        
        this.grid = Board.nullGrid();
        this.setupPieces();
        this.fillNullWithEmptyPieces();
    }

    setupPieces() {

        this.placeBackRow(0, "black");
        this.placePawnRow(1, "black");
    
        this.placeBackRow(7, "white");
        this.placePawnRow(6, "white");
    }
    
    place(piece, side, position) {
        let r = 8-parseInt(position.substring(1, 2));
        let c = position.substring(0, 1).toLowerCase();
        
        switch (c) {
            case "a": c=0; break;
            case "b": c=1; break;
            case "c": c=2; break;
            case "d": c=3; break;
            case "e": c=4; break;
            case "f": c=5; break;
            case "g": c=6; break;
            case "h": c=7; break;
        }

        switch (piece) {
            case "K": this.set(r, c,  new King(r, c, side)); break;
            case "Q": this.set(r, c,  new Queen(r, c, side)); break;
            case "R": this.set(r, c,  new Rook(r, c, side)); break;
            case "B": this.set(r, c,  new Bishop(r, c, side)); break;
            case "N": this.set(r, c,  new Knight(r, c, side)); break;
            case "P": this.set(r, c,  new Pawn(r, c, side)); break;
        }
    }

    placeBackRow(row, side) {
        this.set(row, 0,  new Rook(row, 0, side));
        this.set(row, 1,  new Knight(row, 1, side));
        this.set(row, 2,  new Bishop(row, 2, side));
        this.set(row, 3,  new Queen(row, 3, side));
        this.set(row, 4,  new King(row, 4, side));
        this.set(row, 5,  new Bishop(row, 5, side));
        this.set(row, 6,  new Knight(row, 6, side));
        this.set(row, 7,  new Rook(row, 7, side));
    
    }
    
    placePawnRow(row, side) {
        for (let i=0; i<8; i++) {
            this.set(row, i, new Pawn(row, i, side));
        }
    }

    fillNullWithEmptyPieces() {
        for (let r=0; r<8; r++) {
            for (let c=0; c<8; c++) {
                if (this.get(r, c) === null) this.set(r, c, new EmptyPiece(r, c, "none"));
            }
        }
    }

    getRowCount() {return this.grid.length; }
    getColumnCount() {return this.grid[0].length; }

    get(row, column) {
        return this.grid[row][column];
    }

    set(row, column, piece) {
        this.grid[row][column] = piece;
    }

    getForward(piece) {
        return piece.side == "white" ? -1 : 1;
    }

    getDirection(piece, rowOffset, columnOffset) {
        let newRow = piece.row + rowOffset;
		let newColumn = piece.column + columnOffset;

		if (newRow < 0 || newColumn < 0 || newRow >= this.getRowCount() || newColumn >= this.getColumnCount()) return null;
        return this.get(newRow, newColumn);
    }

    makeMove(move) {

		move.piece1.movedBefore = true;
		move.piece2.movedBefore = true;

		let tempRow = move.piece1.row;
		let tempColumn = move.piece1.column;

		let tempRow2 = move.piece2.row;
		let tempColumn2 = move.piece2.column;

		if (!move.isCapture) {
			move.piece2.setPosition(tempRow, tempColumn);
			this.set(tempRow, tempColumn, move.piece2);
		} else {
			if (move.piece2.constructor.name == "EmptyPiece") {
				//en passant
				let enPassantedPawn = this.getDirection(move.piece1, 0, move.piece2.column - move.piece1.column);
				
				move.piece2 = this.makeMove(new Move(move.piece2, enPassantedPawn, false))[1];
			}
			move.piece2.element.remove();
			this.set(tempRow, tempColumn, new EmptyPiece(tempRow, tempColumn, "none"));
		}

		move.piece1.setPosition(tempRow2, tempColumn2);
		this.set(tempRow2, tempColumn2, move.piece1);

		if (move.piece1.constructor.name != "King") return [move.piece1, move.piece2];

		if (Math.abs(move.piece2.column - move.piece1.column) <= 1) return [move.piece1, move.piece2];

		let rookOffset = Math.sign(move.piece2.column - move.piece1.column);
		let rook = this.get(move.piece1.row, (rookOffset === 1 ? 0 : 7));
		this.makeMove(new Move(rook, this.get(move.piece1.row, move.piece1.column + rookOffset), false));
		
		return [piece1, piece2];

	}

    //returns true for safe moves
	vetMoveForChecks(move) {
		let board = this.makeTheoreticalCopy();

		let piece1 = board.get(move.piece1.row, move.piece1.column);
		let piece2 = board.get(move.piece2.row, move.piece2.column);

		piece1.movedBefore = true;
		piece2.movedBefore = true;

		let tempRow = piece1.row;
		let tempColumn = piece1.column;

		let tempRow2 = piece2.row;
		let tempColumn2 = piece2.column;

		if (!move.isCapture) {
			piece2.setPosition(tempRow, tempColumn);
			board.set(tempRow, tempColumn, piece2);

		} else {
			if (piece2.constructor.name == "EmptyPiece") {
				//en passant
				let enPassantedPawn = board.getDirection(piece1, 0, piece2.column - piece1.column);
				
				piece2 = board.makeMove(new Move(piece2, enPassantedPawn, false))[1];
			}
			board.set(tempRow, tempColumn, new EmptyPiece(tempRow, tempColumn, "none", true));
		}

		piece1.setPosition(tempRow2, tempColumn2);
		board.set(tempRow2, tempColumn2, piece1);

		if (piece1.constructor.name == "King" && Math.abs(piece2.column - piece1.column) > 1) {

			let rookOffset = Math.sign(piece2.column - piece1.column);
			let rook = board.get(piece1.row, (rookOffset === 1 ? 0 : 7));
			board.makeMove(new Move(rook, board.get(piece1.row, piece1.column + rookOffset), false));
		}

		return !board.isInCheck(move.piece1.side);
	}

	isInCheck(side) {

		let king = this.findKing(side);
		let enemyPieces = this.findPieces(Piece.opposite(side));

		let attackersAndDangers = [];

		let allDangers = [];
		//return false;

		for (let i=0; i<enemyPieces.length; i++) {
			let piece = enemyPieces[i];

			let possibleCaptures = piece.getPossibleCaptures(this, "", true);

			for (let d of possibleCaptures) {

				let ad = {
					attacker: piece,
					danger: d
				};

				allDangers.push(ad);
			}
		}

		for (let ad of allDangers) {
			if (ad.danger === null || ad.danger != king || ad.attacker.side == king.side) continue;

			attackersAndDangers.push(ad);
		}

		return attackersAndDangers.length > 0;
	}

    //for checkmate
	checkForCheckmate(side) {
		let pieces = this.findPieces(side);

		let allMoves = [];
		let allCaptures = [];

		for (let piece of pieces) {
			let possibleMoves = piece.getPossibleMoves(this);
			for (let piece2 of possibleMoves) {
				if (piece2 === null) continue;
				
				let obj = {
					piece1: piece,
					piece2: piece2
				}
				allMoves.push(obj);
			}

			let possibleCaptures = piece.getPossibleCaptures(this);
			for (let piece2 of possibleCaptures) {
				if (piece2 === null) continue;
				
				let obj = {
					piece1: piece,
					piece2: piece2
				}
				allCaptures.push(obj);
			}
		}

		for (let i=allMoves.length-1; i>=0; i--) {
			
			let vetted = this.vetMoveForChecks(new Move(allMoves[i].piece1, allMoves[i].piece2, false));
			if (!vetted) {
				allMoves.splice(i, 1);
			}
		}

		for (let i=allCaptures.length-1; i>=0; i--) {
			
			let vetted = this.vetMoveForChecks(new Move(allCaptures[i].piece1, allCaptures[i].piece2, true));
			if (!vetted) {
				allCaptures.splice(i, 1);
			}
		}

		return allMoves.length + allCaptures == 0;
	}

	findKing(side) {
		let king = null;

		for (let r=0; r<this.getRowCount(); r++) {
			for (let c=0; c<this.getColumnCount(); c++) {
				if (this.get(r, c) === null) continue;
				if (this.get(r, c).side != side) continue;
				if (this.get(r, c).constructor.name != "King") continue;

				king = this.get(r, c);
				break;
			}

			if (king !== null) break;
		}

		return king;
	}

	findPieces(side) {
		let pieces = [];

		for (let r=0; r<this.getRowCount(); r++) {
			for (let c=0; c<this.getColumnCount(); c++) {
				if (this.get(r, c) === null) continue;
				if (this.get(r, c).side != side) continue;

				pieces.push(this.get(r, c));
			}
		}

		return pieces;
	}

    getByPosition(position) {
        let r = 8-parseInt(position.substring(1, 2));
        let c = position.substring(0, 1).toLowerCase();
        
        switch (c) {
            case "a": c=0; break;
            case "b": c=1; break;
            case "c": c=2; break;
            case "d": c=3; break;
            case "e": c=4; break;
            case "f": c=5; break;
            case "g": c=6; break;
            case "h": c=7; break;
        }

        return this.get(r, c);
    }

    makeTheoreticalCopy() {
        let grid = [];

        for (let r=0; r<8; r++) {
            let arr = [];
            for (let c=0; c<8; c++) {
                arr.push(this.get(r, c).makeTheoreticalCopy());
            }
        
            grid.push(arr);
        }

        return new Board(grid);
    }

    static nullGrid() {
        let grid = [];

        for (let r=0; r<8; r++) {
            let arr = [];
            for (let c=0; c<8; c++) {
                arr.push(null);
            }
        
            grid.push(arr);
        }

        return grid;
    }
}