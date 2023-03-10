import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button 
            className="square" 
            onClick={props.onClick}
        >
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    createRow(row) {
        const columns = []
        for (let column = 0; column < 3; column++) {
            let squareIndex = row * 3 + column
            columns.push(this.renderSquare(squareIndex))
        }
        return columns
    }

    createBoard() {
        const squares = []
        for (let row = 0; row < 3; row++) {
            squares.push(
                <div className="board-row">
                    {this.createRow(row)}
                </div>
            );
        }
        return squares;
    }

    createBoard2() {
        const rows = []
        for (let row = 0; row < 3; row++) {
            let squares = []
            for (let column = 0; column < 3; column++) {
                squares.push(this.renderSquare(3*row + column));
            }
            rows.push(<div className="board-row">{squares}</div>);
        }
        return rows;
    }

    createBoard3() {
        return (
            [...Array(3)].map((_, row) => (
                <div className="board-row">
                    {
                        [...Array(3)].map((_, column) => (
                            this.renderSquare(row * 3 + column)
                        ))
                    }
                </div>
            ))
        )
    }

    render() {
        return (
            <div>
                {this.createBoard3()}
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
            }],
            stepNumber: 0,
            xIsNext: true,
            sortAscending: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                moveIndex: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            moveIndex: i,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    toggleMovesSort() {
        this.setState({
            sortAscending: !this.state.sortAscending,
        })
    }
    
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares);
        const sortText = 'Sort ^';

        const moves = history.map((step, move) => {
            const moveRow = Math.floor(step.moveIndex/3);
            const moveColumn = step.moveIndex % 3;
            const desc = move ?
                'Go to move #' + move + ' (' + moveRow + ',' + moveColumn + ')' :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        style={(this.state.moveIndex === step.moveIndex) ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}
                        onClick={() => this.jumpTo(move)}>{desc}
                    </button>
                </li>
            )
        })

        if (!this.state.sortAscending) {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
                </div>
                <div className="game-info">
                <div>{status}</div>
                <button
                    onClick={() => this.toggleMovesSort()}>Sort {this.state.sortAscending ? '^' : 'v'}
                </button>
                <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

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
            return squares[a];
        }
    }
    return null;
  }

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
