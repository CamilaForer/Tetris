const canvas = document.getElementById("canva");
//Context of canvas
let context = canvas.getContext("2d");
//Squares size
const square_size = screen.width > 425 ? 20 : 15; //Ternary operator if the screen is greater than 425 that the average is 20 if it is not 15
//Number of columns and rows the board will have 
const cols = screen.width > 425 ? 20 : 15;
const rows = screen.width > 425 ? 15 : 20;
canvas.width = cols * square_size;
canvas.height = rows * square_size;
const Score = document.getElementById("score");
//Color of empty squares
const empty = "#000000";
let score = 0;
var gameOver = false;

//function to draw the squares
drawSquares = (x, y, color) => {
    context.fillStyle = color;//Color of the square
    context.fillRect(x * square_size, y * square_size, square_size, square_size)//Value in x, value in y, widht, height of square
    context.strokeStyle = "#6100FF";
    context.strokeRect(x * square_size, y * square_size, square_size, square_size);
}

//Create the board
let board = [];
for (r = 0; r < rows; r++) {
    board[r] = [];
    for (c = 0; c < cols; c++) {
        board[r][c] = empty;
    }
}
//Draw the board
drawBoard = () => {
    for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
            drawSquares(c, r, board[r][c])
        }
    }
}
drawBoard();

//building the pieces with matrices and the positions they will have
const O = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ]
];
const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ]
];
const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
    ],
]
const Z = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
    ],
]
const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];
const L = [
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];
const J = [
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
];
//a color is assigned to each piece
const pieces = [
    [O, "#EFD917"],
    [I, "#07B7EE"],
    [S, "#34DF09"],
    [Z, "#FF0101"],
    [T, "#BD00FF"],
    [L, "#FF5C00"],
    [J, "#0038FF"]
];
//We generate random pieces. A random number between 0 and 6 is chosen, which will be the index to select the piece of the matrix.
function randomPiece() {
    if (!gameOver) {//If the function is different from game over
        let randPiece = Math.floor(Math.random() * pieces.length)//Math.floor rounds down and returns the largest integer less than or equal to a given number.
        return new Piece(pieces[randPiece][0], pieces[randPiece][1])//Returns a new piece with the arguments for the parameters requested by the function, which are the type of piece and its color.
    }
}
let p = randomPiece();

function Piece(figure, color) {
    this.figure = figure;
    this.color = color;
    this.newFigure = 0;//Starts from the first position of the figure,index for the matrix of positions of each piece
    this.actFigure = this.figure[this.newFigure];//Selected figure in a specific position
    //Here we define the location of the pieces when they appear on the board for the first time
    this.x = 7;//The figure appears at position 7 in x
    this.y = -1;
}

Piece.prototype.fill = function (color) {
    for (r = 0; r < this.actFigure.length; r++) {// Array's rows  of the figure's specific position 
        for (c = 0; c < this.actFigure.length; c++) {// Array's cols  of the figure's specific position 
            //We draw only the occupied square
            if (this.actFigure[r][c]) {// each square in the array of the specific position of the figure
                drawSquares(this.x + c, this.y + r, color);
            }
        }
    }
}
//Draw a piece to the board
Piece.prototype.draw = function () {
    this.fill(this.color);
}
//Color for empty or not drawn squares
Piece.prototype.unDraw = function () {
    this.fill(empty);
}
//Move down the piece
Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.actFigure)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        //We look the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
}
//Move right the piece
Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.actFigure)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}
//Move left the piece
Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.actFigure)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}
 //Rotate the piece
Piece.prototype.rotate = function () {
    let nextPat = this.figure[(this.newFigure + 1) % this.figure.length];// Increment the figure number 
    let kick = 0;

    if (this.collision(0, 0, nextPat)) {
        if (this.x > cols / 2) {// Collision in the right wall
            kick = -1;//We need to move the piece to the left
        } else {
            kick = 1;//We need to move the piece to the right
        }
    }

    if (!this.collision(kick, 0, nextPat)) {
        this.unDraw();
        this.x += kick;
        this.newFigure = (this.newFigure + 1) % this.figure.length;
        this.actFigure = this.figure[this.newFigure];
        this.draw();
    }
}

// Lock the piece when it reaches the end or when it is over another figure
Piece.prototype.lock = function () {
    for (r = 0; r < this.actFigure.length; r++) {
        for (c = 0; c < this.actFigure.length; c++) {
            if (!this.actFigure[r][c]) {
                continue;
            }
            // Piece to lock on top = game over
            if (this.y + r < 1) {
               (async () => {
                const {value: restartGame} = await Swal.fire({
                    title: '<span class="white">Game Over</span>',
                    background:"#000",
                    imageUrl :"img/game over.png",
                    imageWidth:150,
                    allowOutsideClick:false,
                    confirmButtonText:'Volver a jugar'
                  });
                  if(restartGame){
                    restart();
                }
               })()
               //losing the game stops the counter clearInterval
               clearInterval(intervalId)
            }
            board[this.y + r][this.x + c] = this.color;
        }
    }
        
     //Delete entire rows and add points 10 points per row to the score 
    for (r = 0; r < rows; r++) {
        let isRowFull = true;
        for (c = 0; c < cols; c++) {
            isRowFull = isRowFull && (board[r][c] != empty);// The row is full, all of the square taken and have a color
        }
        if (isRowFull) {
            // if the row is full
            // we move down all the rows above it
            for (y = r; y > 1; y--) {
                for (c = 0; c < cols; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            for (c = 0; c < cols; c++) {
                board[0][c] = empty;
            }
            score += 10;
        }
       
    }
    // update the board and the score
    drawBoard();
    Score.innerHTML = score;
    
}

Piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {//Check all the squares of the figure
        for (c = 0; c < piece.length; c++) {
             // if the square is empty within the piece array, we skip it
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (newX < 0 || newX >= cols || newY >= rows) {// Collision due to the canva's margin
                return true;
            }
             // skip newY < 0; board[-1] will crush our game because there is not index with -1
            if (newY < 0) {
                continue;
            }
             // check if there is a locked piece alrady in place
            if (board[newY][newX] != empty) {
                return true;
            }
        }
    }
    return false;
}

document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (event.key == "ArrowLeft") {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.key == "ArrowUp") {
        p.rotate();
        dropStart = Date.now();
    } else if (event.key == "ArrowRight") {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.key == "ArrowDown") {
        p.moveDown();
    }
}

let upButton = document.getElementById("up-button");
    upButton.onclick = function () {
    p.rotate();
}
let moveLeft = document.getElementById("moveLeft");
     moveLeft.onclick = function () {
    p.moveLeft();
}
let moveRight = document.getElementById("moveRight");
moveRight.onclick = function () {
    p.moveRight();
}
let moveDown= document.getElementById("moveDown");
    moveDown.onclick=function(){
    p.moveDown();
}


let dropStart = Date.now();

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 550) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}
drop();
// Quit game and start a new one
function restart() {
    window.location.reload()
}