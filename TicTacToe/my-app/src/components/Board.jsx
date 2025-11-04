import React from 'react';
import Square from './Square';

export default class Board extends React.Component {
    createBoard() {
        return (
            [...Array(3)].map((_, row) => (
                <div className='board-row'>
                    {
                        [...Array(3)].map((_, column) => (
                            <Square 
                                value={this.props.squares[row * 3 + column]}
                                onClick={() => this.props.onClick(row * 3 + column)}
                            />
                        ))
                    }
                </div>
            ))
        )
    }

    render() {
        return (
            <div>
                {this.createBoard()}
            </div>
        );
    }
}