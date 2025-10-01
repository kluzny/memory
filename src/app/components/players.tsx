import { useState } from "react";

import { Player } from "@/types";
import PlayerCard from "@/app/components/player-card";

interface PlayerProps {
  playerData: Player[];
  addPlayer: (name: string) => void;
  activePlayer?: Player;
}

export default function Players({
  playerData,
  addPlayer,
  activePlayer,
}: PlayerProps) {
  const [playerName, setPlayerName] = useState("");

  const players = playerData.map((player) => {
    return (
      <PlayerCard
        key={player.id}
        player={player}
        active={player.id == activePlayer?.id}
      />
    );
  });

  const playerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value);
  };

  const submitPlayerName = () => {
    if (playerName.length == 0) {
      console.log("ignoring empty submit");
    } else {
      addPlayer(playerName);
      setPlayerName("");
    }
  };

  const playerKeyUp = (event: React.KeyboardEvent) => {
    if (event.key == "Enter") {
      submitPlayerName();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center space-x-2">
        <input
          type="text"
          placeholder="Add Player"
          className="px-2 py-1 w-full bg-white text-xl rounded-sm"
          value={playerName}
          onChange={playerInputChange}
          onKeyUp={playerKeyUp}
        />
        <button
          className="px-2 py-1 border-2 rounded-lg border-blue-500 bg-white hover:bg-pink-200"
          onClick={submitPlayerName}
        >
          Add
        </button>
      </div>
      {players}
    </div>
  );
}
