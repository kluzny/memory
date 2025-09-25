import Greeting from "@/app/components/greeting";
import BoardSizePicker from "@/app/components/board-size-picker";

export default function Setup({playerCount, boardSize, setBoardSize, startGame}) {
  let gameReady = playerCount > 0;

  return (
    <div className="flex flex-col justify-center items-center space-y-8">
      <Greeting />
      <BoardSizePicker boardSize={boardSize} setBoardSize={setBoardSize} />
      {gameReady && (
        <button
          onClick={startGame}
          className="px-8 py-4 text-4xl rounded-lg border-2 border-blue-500 bg-blue-300 text-white font-bold hover:border-pink-500 hover:bg-pink-200">
          Play!
        </button>
      )}
    </div>
  )
}