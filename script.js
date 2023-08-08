const gameBoard = (function () {
    const board = [
        ["X", "O", "X"],
        ["X", "X", "O"],
        ["O", "X", "O"],
    ];

    const placeSign = (x, y, sign) => {
        if (x > 2 || y > 2 || x < 0 || y < 0) {
            console.error("Invalid coordinates");
            return;
        }

        if (board[x][y]) {
            console.error("That position is already taken");
            return;
        }

        board[x][y] = sign;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = "";
            }
        }
    };

    return {
        placeSign,
        resetBoard,
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
        board: [
            ["X", "O", "X"],
            ["X", "X", "O"],
            ["O", "X", "O"],
        ],
        get sign() {
            return sign;
        },
        set sign(newSign) {
            sign = newSign;
        },

        placeSign,
    };
};
