import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// UI colors
const lightBlue = "#ABFCFB";
const lightPink = "#FDD6FF";
const lightYellow = "#FFFFC9";
const lightGreen = "#C5FFEA";
const fullBlue = "#2DF8F5";
const fullPink = "#FB98FE";
const fullYellow = "#FFFF78";
const fullGreen = "#6DFECA";

function Square(props) {
    return (
        <button className="square flex-column" onClick={props.onClick} style={props.style}>
            {props.value}
        </button>
    );
}

function Header() {
    return (
        <div className="header flex-column">
            <h1>Tic Tac Toe</h1>
            <h3>You know the game. Click one of the cells to start!</h3>
        </div>
    );
}

class Board extends React.Component {
    renderSquare(i, line) {
        const wLine = this.props.winningLine != null ?
            this.props.winningLine.includes(i) ?
                {backgroundColor: lightYellow} :
                {} : {};
        const markColor = this.props.squares[i] != null ?
            this.props.squares[i] === "X" ?
                {color: fullBlue} :
                {color: fullPink} : {};
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                style={{...wLine, ...markColor}}
            />
        );
    }
    createSquares() {
        let rows = [];
        for (let r = 0; r < 3; r++) {
            let squares = [];
            for (let c = 0; c < 3; c++) {
                squares.push(this.renderSquare(3*r + c));
            }
            rows.push(<div className="board-row flex-row">{squares}</div>);
        }
        return rows;
    }
    render() {
        return (
            <div className="board-container">
                {this.createSquares()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                movesMade: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            maxSteps: 9,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber +1);
        const current = history[history.length - 1];
        const squares = [...current.squares];

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        const moveMade = squares[i] + " (" + this.squareIndexToRowCol(i).join() +")";

        this.setState({
            history: history.concat([{
                squares: squares,
                movesMade: moveMade,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    squareIndexToRowCol(index) {
        let row;
        let col;
        const offset = 1;
        // indices are 0-8
        if (index >= 6) {
            row = 2 + offset;
            col = index - 6 + offset;
        } else if (index >= 3) {
            row = 1 + offset;
            col = index - 3 + offset;
        } else {
            row = 0 + offset;
            col = index - 0 + offset;
        }
        return ([col, row]);
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares) ? calculateWinner(current.squares).winner : null;
        const winningLine = calculateWinner(current.squares) ? calculateWinner(current.squares).winningLine : null;

        const moves = history.map( (step, move) => {
            const desc = move ?
                "Go to move #" + move :
                "Go to game start";
            const coordString = history[move].movesMade != null ?
                " - " + history[move].movesMade :
                "";
            const boldStep = move === this.state.stepNumber ?
                {border: "3px solid " + fullGreen , backgroundColor: lightGreen}:
                {};
            return (
                <li key={move}>
                    <button
                        className="history-button"
                        onClick={() => this.jumpTo(move)}
                        style={boldStep}
                    >
                        {desc}{coordString}
                    </button>
                </li>
            );
        })

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else if (!winner && this.state.stepNumber < this.state.maxSteps){
            status = 'Next player: ' + (this.state.xIsNext ? "X" : "O");
        } else {
            status = "Draw!";
        }

        return (
            <div className="main flex-column">
                <div className="header-row flex-row">
                    <Header />
                </div>
                <div className="game flex-row">
                    <div className="game-board flex-column">
                        <Board
                            squares={current.squares}
                            winningLine={winningLine}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                    <div className="game-info flex-column">
                        <div className="status">{status}</div>
                        <ol className="move-history">{moves}</ol>
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game/>, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      let winningLine = lines[i];
      return {
          winner: squares[a],
          winningLine: winningLine,
      };
    }
  }
  return null;
}
