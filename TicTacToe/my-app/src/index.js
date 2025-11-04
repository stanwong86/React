import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Board from './components/Board.jsx'

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
    
    calculateWinner = (squares) => {
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

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (this.calculateWinner(squares) || squares[i]) {
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
        const winner = this.calculateWinner(current.squares);

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

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
        <Game />
    </StrictMode>
);
