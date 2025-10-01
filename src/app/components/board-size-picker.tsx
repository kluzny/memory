import { Dispatch, SetStateAction, useContext } from "react";
import { DebugContext } from "@/contexts/DebugContext";

const availableButtonSizes: Record<string, number> = {
  Small: 4, // 16
  Medium: 5, // 25 -1
  Large: 6, // 36
  Super: 7, // 49 -1
  Huge: 8, // 64
};

interface BoardSizePickerProps {
  boardSize: number;
  setBoardSize: Dispatch<SetStateAction<number>>;
}

export default function BoardSizePicker({
  boardSize,
  setBoardSize,
}: BoardSizePickerProps) {
  const isDebug = useContext(DebugContext);

  if (isDebug) {
    availableButtonSizes["XS"] = 2;
  }

  const boardSizeButtons = Object.entries(availableButtonSizes).map(
    ([name, size]) => {
      let borderColor;
      if (size == boardSize) {
        borderColor = "border-pink-500";
      } else {
        borderColor = "border-blue-500";
      }

      return (
        <button
          key={size}
          onClick={() => {
            setBoardSize(size);
          }}
          className={`px-4 py-2 border-2 rounded-lg ${borderColor} bg-white hover:bg-pink-200`}
        >
          {name}
        </button>
      );
    }
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <h3 className="mb-2">Choose the game size:</h3>
      <div className="flex space-x-2">{boardSizeButtons}</div>
    </div>
  );
}
