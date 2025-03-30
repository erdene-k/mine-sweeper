import React from 'react';
import {CellProps} from "@/types";

const Cell = ({value, state, row, col, onClick, onRightClick}: CellProps) => {
    const handleClick = () => {
        onClick(row, col);
    };

    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onRightClick(row, col);
    };

    const getCellContent = () => {
        if (state === 'hidden') return null;
        if (state === 'flagged') return '🏴';
        if (value === 'mine') return '💥';
        if (value === 0) return null;
        return value;
    };

    const getCellStyle = () => {
        let className = 'w-10 h-10 flex items-center justify-center border border-gray-400 ';

        if (state === 'hidden') {
            className += 'bg-gray-300 hover:bg-gray-200';
        } else if (state === 'revealed') {
            className += 'bg-white';

            if (typeof value === 'number') {
                switch (value) {
                    case 1:
                        className += ' text-blue-600';
                        break;
                    case 2:
                        className += ' text-green-600';
                        break;
                    case 3:
                        className += ' text-red-600';
                        break;
                }
            }
        } else if (state === 'flagged') {
            className += 'bg-gray-300';
        }

        return className;
    };

    return (
        <button
            className={getCellStyle()}
            onClick={handleClick}
            onContextMenu={handleRightClick}
        >
            {getCellContent()}
        </button>
    );
};

export default Cell;