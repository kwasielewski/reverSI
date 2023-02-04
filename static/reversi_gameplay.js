let initBoard = [[0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, -1, 1, 0, 0, 0],
                 [0, 0, 0, 1, -1, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0],
                 [0, 0, 0, 0, 0, 0, 0, 0]]

function drawBoard() { //board) {
    // ideally we would like to move the scipt for drawing the board here so that both attack & defence can use it

    const squareSize = 60;

    let canvas = document.getElementById('canvasBoard');
    context = canvas.getContext('2d');

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            context.fillStyle = ((row + col) % 2 == 0) ? 'grey' : 'lightgrey';
            let xOffset = col*squareSize;
            let yOffset = row*squareSize;
            context.fillRect(xOffset, yOffset, squareSize, squareSize);
        }
    }

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (initBoard[row][col] != 0) {
                context.beginPath();
                context.arc(col*squareSize + squareSize/2, row*squareSize + squareSize/2, 25, 0, 2*Math.PI, false);
                context.fillStyle = (initBoard[row][col] == -1) ? 'white' : 'black';
                context.fill();
            }
        }
    }

    context.strokeStyle = "black";
    context.strokeRect(0, 0, squareSize*8, squareSize*8)
}

function checkCell(board, cellID) {
    // first recognize what the player clicked
    // see if this cell can be selected according to game rules
}

function selectCell(board, cellID) {
    // if the cell is can be selected we:
    //  - draw an appropriate circle
    //  - flip the other discs
    //  - pass the resulting object back to the socket.emit method
}

window.onload = drawBoard;