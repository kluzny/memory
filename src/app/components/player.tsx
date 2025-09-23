interface PlayerProps {
  player: {
    name: string;
    score: number;
    active: boolean;
  };
}

const activeClasses = "border-4 border-pink-500 rounded-lg";

export default function Player({ player }: PlayerProps) {
  return (
    <div className={"p-4 bg-blue-500 " + (player.active ? activeClasses : "")}>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl underline decoration-dashed mb-4">
          {player.name}
        </h2>
        <h2 className="text-3xl">{player.score}</h2>
      </div>

      <div className="grid grid-cols-8 gap-4">
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
        <div className="flex space-x-1">
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
          <div className="h-8 w-8 rounded-lg border-4 border-black"></div>
        </div>
      </div>
    </div>
  );
}
