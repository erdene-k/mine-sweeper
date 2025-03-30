export type CellValue = number | 'mine' | null;
export type CellState = 'hidden' | 'revealed' | 'flagged';

export interface CellProps {
  value: CellValue;
  state: CellState;
  row: number;
  col: number;
  onClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
}

export interface GameBoardProps {
  rows: number;
  cols: number;
  mineCount: number;
}