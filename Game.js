class Game {
    constructor(turn, board) {
        this.playerTurn = turn;
        this.selectedPiece = null;
        this.moves = [];
        this.captures = [];
        this.board = board;
        this.lastMove = [];
    }
}