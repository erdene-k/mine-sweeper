import React, {useState, useEffect} from 'react';
import {CellState, CellValue, GameBoardProps} from "@/types";
import Cell from "@/MineSweeper/Cell";

const GameBoard: React.FC<GameBoardProps> = ({rows = 4, cols = 4, mineCount = 3}) => {
    const [board, setBoard] = useState<{ value: CellValue; state: CellState }[][]>([]);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [flagCount, setFlagCount] = useState(0);

    useEffect(() => {
        initializeBoard();
    }, []);

    const initializeBoard = () => {
        const newBoard = Array(rows).fill(null).map(() =>
            Array(cols).fill(null).map(() => ({
                value: null,
                state: 'hidden' as CellState
            }))
        );

        let minesPlaced = 0;
        while (minesPlaced < mineCount) {
            const randomRow = Math.floor(Math.random() * rows);
            const randomCol = Math.floor(Math.random() * cols);

            if (newBoard[randomRow][randomCol].value !== 'mine') {
                // @ts-ignore
                newBoard[randomRow][randomCol].value = 'mine';
                minesPlaced++;
            }
        }

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (newBoard[row][col].value !== 'mine') {
                    // @ts-ignore
                    newBoard[row][col].value = countAdjacentMines(newBoard, row, col);
                }
            }
        }

        setBoard(newBoard);
        setGameStatus('playing');
        setFlagCount(0);
    };

    const countAdjacentMines = (board: { value: CellValue; state: CellState }[][], row: number, col: number) => {
        let count = 0;

        for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
                if (r === row && c === col) continue;
                if (board[r][c].value === 'mine') count++;
            }
        }

        return count;
    };

    const handleCellClick = (row: number, col: number) => {
        if (gameStatus !== 'playing') return;
        if (board[row][col].state === 'flagged') return;
        const newBoard = [...board.map(row => [...row])];
        if (newBoard[row][col].value === 'mine') {
            revealAllMines(newBoard);
            setGameStatus('lost');
            return;
        }

        revealCell(newBoard, row, col);

        if (checkWinCondition(newBoard)) {
            setGameStatus('won');
        }

        setBoard(newBoard);
    };

    const handleCellRightClick = (row: number, col: number) => {
        if (gameStatus !== 'playing') return;

        if (board[row][col].state === 'revealed') return;

        const newBoard = [...board.map(row => [...row])];

        if (newBoard[row][col].state === 'hidden') {
            newBoard[row][col].state = 'flagged';
            setFlagCount(flagCount + 1);
        } else {
            newBoard[row][col].state = 'hidden';
            setFlagCount(flagCount - 1);
        }

        setBoard(newBoard);
    };

    const revealCell = (board: { value: CellValue; state: CellState }[][], row: number, col: number) => {
        if (board[row][col].state !== 'hidden') return;

        board[row][col].state = 'revealed';

        if (board[row][col].value === 0) {
            for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
                for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
                    if (r === row && c === col) continue;
                    revealCell(board, r, c);
                }
            }
        }
    };

    const revealAllMines = (board: { value: CellValue; state: CellState }[][]) => {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (board[row][col].value === 'mine') {
                    board[row][col].state = 'revealed';
                }
            }
        }
    };

    const checkWinCondition = (board: { value: CellValue; state: CellState }[][]) => {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (board[row][col].value !== 'mine' && board[row][col].state !== 'revealed') {
                    return false;
                }
            }
        }
        return true;
    };

    const getGameStatusMessage = () => {
        if (gameStatus === 'won') return 'You won!';
        if (gameStatus === 'lost') return 'Game over!';
        return null;
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md">
            <div className="mb-4 flex items-center justify-between w-full px-2">
                <div className="flex items-center space-x-2">
                    <span>Number</span>
                    <span>{mineCount - flagCount}</span>
                </div>
                <div className="text-lg font-semibold">
                    {getGameStatusMessage()}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-1 mb-4">
                {board.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            value={cell.value}
                            state={cell.state}
                            row={rowIndex}
                            col={colIndex}
                            onClick={handleCellClick}
                            onRightClick={handleCellRightClick}
                        />
                    ))
                ))}
            </div>

            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={initializeBoard}
            >
                Start
            </button>
        </div>
    );
};

export default GameBoard;