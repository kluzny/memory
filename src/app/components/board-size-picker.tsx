import { Dispatch, SetStateAction } from "react";

const availableButtonSizes = {
  Small: 4,
  Medium: 5,
  Large: 6,
  Super: 7,
  Huge: 8,
};

interface BoardSizePickerProps {
  setBoardSize: Dispatch<SetStateAction<number>>;
}

export default function BoardSizePicker({
  setBoardSize,
}: BoardSizePickerProps) {
  const boardSizeButtons = Object.entries(availableButtonSizes).map(
    ([name, size]) => (
      <button
        key={size}
        onClick={() => {
          setBoardSize(size);
        }}
        className="px-4 py-2 border-1 rounded-lg border-black bg-white hover:bg-gray-400"
      >
        {name}
      </button>
    )
  );

  return (
    <>
      <h3>Choose the board size:</h3>
      <div className="flex space-x-2">{boardSizeButtons}</div>
    </>
  );
}
