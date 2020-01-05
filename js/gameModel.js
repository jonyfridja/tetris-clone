const SQUARE_CLEAR_COLOR = '#000000';
const PIECES = ['orange']

class Piece {
    prevCoords;
    coords;
    orientations;
    color;
    constructor(color) {
        this.prevCoords = [];
        this.color = color;
        this.coords = [
            { row: 1, col: 5 },
            { row: 1, col: 4 },
            { row: 0, col: 5 },
            { row: 0, col: 4 },
        ];
        switch (color) {
            case "orange":
                this.orientations = [
                    [
                        { col: 0, row: 0 },
                        { col: 0, row: 1 },
                        { col: 1, row: 0 },
                        { col: 1, row: 1 },
                    ],// add more positions here
                ]
                break;
        }
    }
    toString() {
        return `${this.color} Piece`;
    }
}

let model = {
    ctx: null,
    canvas: null,
    boxWidth: 35,
    boxHeight: 35,
    isGameRunning: true,
    board: null,
    rotate,
    descend,
    update() {
        if (this.isGameRunning) {
            this.updateModel();
            this.updateBoard();
        }
        return this.isGameRunning;
    },
    updateModel() {
        this.move('down');
    },
    move(dir) {
        if (!this.currPiece) { _nextPiece(); }
        const { coords } = this.currPiece;
        const nextCoords = _nextPosition(this.currPiece, dir);
        const complimentNextCoords = _relativeComplimentB(coords, nextCoords);
        if (!this.isColliding(complimentNextCoords)) {
            this.currPiece.prevCoords = [...this.currPiece.coords];
            this.currPiece.coords = nextCoords;
            // console.log('nextCoords === this.currPiece.coords', nextCoords === this.currPiece.coords)
        } else {
            // can get 'wall' 'fail'
            if (!_isWallCollision(complimentNextCoords)) {
                _nextPiece();
                // the code below might seem odd, because we've already checked for collision
                // but this check is about 
                // the first piece spawn position and if there is anything there
                if (this.isColliding(this.currPiece.coords)) {
                    this.isGameRunning = false;
                    console.log('isGameRunning', this.isGameRunning)
                }
            }
        }
        this.updateBoard();
    },
    isColliding(newCoords) {
        return newCoords.some(_isTakenOrOut);
    },
    updateBoard() {
        const { prevCoords } = this.currPiece;
        const { coords } = this.currPiece;
        // console.log('on screen coords', prevCoords);
        // console.log('next frame coords', coords);
        if (!prevCoords.length) {
            this.currPiece.prevCoords = coords.slice();
        } else prevCoords.forEach(_clearCoord)

        coords.forEach(coord => {
            _updateColor(coord, this.currPiece.color);
        });
        this.render();
    },
    render() {
        this.ctx.fillStyle = '#242323';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                const color = this.board[i][j].color;
                this.ctx.fillStyle = this.board[i][j].color;
                this.ctx.fillRect(1 + j * (this.boxWidth + 1),
                    1 + i * (this.boxHeight + 1),
                    this.boxWidth, this.boxHeight);
            }
        }
    },
    piecesQueue: [],
    currPiece: null
}

function _isWallCollision(coords) {
    return coords.every(coord => coord.col === 10) ||
        coords.every(coord => coord.col === -1)
}

function _relativeComplimentB(groupA, groupB) {

    let relativeComplimentB = groupB.filter(coordB => {
        return !groupA.some(coordA => {
            return coordB.row === coordA.row && coordB.col === coordA.col;
        })
    })
    // console.log(groupA);
    // console.log(groupB);
    // console.log(relativeComplimentB);
    return relativeComplimentB
}

_initBoard();
_initPieceQueue();

function _nextPiece() {
    // this is really funny - >
    // try debugging this code in chrome, and mark model.piecesQueue.shift();
    // try it a couple of times and see what happens
    model.currPiece = model.piecesQueue.shift();
    model.piecesQueue.push(_randomPiece());
}

function _randomPiece() {
    // const randomIndex = _getRandomIntInclusive(0, 1)
    const randomIndex = 0

    const color = PIECES[randomIndex]
    return new Piece(color);
}

function _isTakenOrOut({ row, col }) {
    return row >= 20 || row <= -1
        || col >= 10 || col <= -1
        || model.board[row][col].color !== SQUARE_CLEAR_COLOR
}

function _nextPosition(piece, dir) {
    const diff = _getDiff(dir);
    // console.log('diff is', diff);
    let nextPositionCoords = piece.coords.map(coord => {
        let nextCoord = { row: coord.row + diff.row, col: coord.col + diff.col }
        return nextCoord;
    })
    // console.log('next position', nextPositionCoords)
    return nextPositionCoords;
}
// const squareObj = {
//     color: "#000" // if(SQUARE_CLEAR_COLOR there is no peices)
// }

function rotate() {

}
function descend() {

}
export default model;

function _getDiff(dir) {
    // console.log('dir is', dir)
    const dirs = {
        left: { col: -1, row: 0 },
        right: { col: 1, row: 0 },
        down: { col: 0, row: 1 }
    };
    // debugger;
    const res = dirs[dir]
    return res;
}

function _initBoard() {
    let board = []
    for (let i = 0; i < 20; i++) {
        let row = [];
        for (let j = 0; j < 10; j++) {
            let color = SQUARE_CLEAR_COLOR;
            row.push({ color })
        }
        board.push(row);
    }
    model.board = board;
}

function _initPieceQueue() {
    for (let i = 0; i < 3; i++) {
        const randomPiece = _randomPiece();
        model.piecesQueue.push(randomPiece);
    }
    console.log(model.piecesQueue);
}

function _getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function _clearCoord({ row, col }) {
    model.board[row][col].color = SQUARE_CLEAR_COLOR;
}
function _updateColor({ row, col }, color) {
    model.board[row][col].color = color;
}