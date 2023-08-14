const gameBoard = (function () {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const gameBoardElement = document.getElementById("game-board");

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = "";
                const cell =
                    gameBoardElement.querySelectorAll(".board-cell")[i * 3 + j];
                cell.classList.add("emtpy");
            }
        }
    };

    const renderBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = gameBoardElement.children[i * 3 + j];
                if (!(board[i][j].trim() === "")) {
                    cell.querySelector("p").textContent = board[i][j];
                    cell.classList.remove("empty");
                }
            }
        }
    };

    const placeSign = (x, y, sign) => {
        if (x > 2 || y > 2 || x < 0 || y < 0) {
            console.error("Invalid coordinates");
            return;
        }

        if (board[x][y]) {
            return;
        }

        board[x][y] = sign;

        renderBoard();
    };

    const checkWin = (sign) => {
        // Check rows
        for (let i = 0; i < board.length; i++) {
            if (
                board[i][0] === sign &&
                board[i][1] === sign &&
                board[i][2] === sign
            ) {
                return true;
            }
        }

        // Check columns
        for (let j = 0; j < board[0].length; j++) {
            if (
                board[0][j] === sign &&
                board[1][j] === sign &&
                board[2][j] === sign
            ) {
                return true;
            }
        }

        // Check diagonals
        if (
            board[0][0] === sign &&
            board[1][1] === sign &&
            board[2][2] === sign
        ) {
            return true;
        }
        if (
            board[0][2] === sign &&
            board[1][1] === sign &&
            board[2][0] === sign
        ) {
            return true;
        }

        // No win condition met
        return false;
    };

    return {
        placeSign,
        resetBoard,
        renderBoard,
    };
})();

const Player = function (name, sign) {
    const placeSign = (x, y) => {
        gameBoard.placeSign(x, y, sign);
    };

    return {
        get name() {
            return name;
        },
        set name(newName) {
            name = newName;
        },

        get sign() {
            return sign;
        },
        set sign(newSign) {
            sign = newSign;
        },

        placeSign,
    };
};

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

const gameStatus = (function () {
    let currentPlayer = player1;
    const switchPlayer = () => {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        } else {
            currentPlayer = player1;
        }
    };

    const placeSign = (x, y) => {
        currentPlayer.placeSign(x, y);
        switchPlayer();
    };

    return {
        placeSign,
    };
})();
