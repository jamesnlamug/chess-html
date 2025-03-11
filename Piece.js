const chessboard = document.getElementById("chess-board");
const tileSize = 128;
const tileMargin = 8;
const tilePadding = 4;
const leftOffset = 256;
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
			this.selectionFunction = function() {
				selectPiece(piece);
			}

			this.setPosition(row, column);
			this.element.addEventListener("click", this.selectionFunction);
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

	static opposite(side) {
		return side=="white" ? "black" : "white";
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
		if (this.theoretical) string = "TH-" + string;
		return string;
	}

}