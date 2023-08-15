const gameBoard = (function () {
    const board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const gameBoardElement = document.getElementById("game-board");

    const setClickListener = (event) => {
        let targetElem;
        if (event.target.tagName === "P") {
            targetElem = event.target.parentElement;
        } else {
            targetElem = event.target;
        }

        if (!targetElem.classList.contains("empty")) {
            return;
        }

        const index = parseInt(targetElem.id.split("-")[1]);
        const x = parseInt((index - 1) / 3);
        const y = (index - 1) % 3;

        gameStatus.placeSign(x, y);
    };

    const makeCell = (num, sign) => {
        const htmlString = `
            <div class="board-cell ${
                sign === "" ? "empty" : ""
            }" id="cell-${num}">
                <p>${sign}</p>
            </div>
        `;

        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlString;
        const cell = tempElement.firstElementChild;

        cell.addEventListener("click", (e) => {
            setClickListener(e);
        });

        return cell;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = "";
            }
        }
        renderBoard();
    };

    const renderBoard = () => {
        gameBoardElement.innerHTML = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = makeCell(i * 3 + j + 1, board[i][j].trim());

                gameBoardElement.appendChild(cell);
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
        renderBoard,
        resetBoard,
        checkWin,
    };
})();

const Player = function (name, sign) {
    const placeSign = (x, y) => {
        gameBoard.placeSign(x, y, sign);
    };

    let score = 0;

    const incrementScore = () => {
        score++;
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
        incrementScore,
    };
};

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

const gameStatus = (function () {
    let currentPlayer = player1;

    const setCurrentPlayer = (player) => {
        currentPlayer = player;

        const currentPlayerElement = document.querySelector(
            ".current-player > p"
        );

        currentPlayerElement.textContent = currentPlayer.name;
    };

    const switchPlayer = () => {
        if (currentPlayer === player1) {
            setCurrentPlayer(player2);
        } else {
            setCurrentPlayer(player1);
        }
    };

    const placeSign = (x, y) => {
        currentPlayer.placeSign(x, y);
        checkWinAndIncrement();
        switchPlayer();
    };

    const resetGame = () => {
        gameBoard.resetBoard();
        setCurrentPlayer(player1);
    };

    const checkWinAndIncrement = () => {
        if (gameBoard.checkWin(currentPlayer.sign)) {
            currentPlayer.incrementScore();
            const winningPlayer = currentPlayer;
            setTimeout(() => {
                alert(`${winningPlayer.name} wins!`);
                gameBoard.resetBoard();
            }, 500);
        }
    };

    return {
        placeSign,
        resetGame,
    };
})();

const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => {
    // for now it will just reset the board, eventually it will reset the scores as well
    gameStatus.resetGame();
});

gameBoard.renderBoard();
