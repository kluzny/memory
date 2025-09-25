import { useState } from "react";

import Player from "@/app/components/player";

export default function Players({ playerData, addPlayer }) {
  const [playerName, setPlayerName] = useState("");

  const players = playerData.map((player) => (
    <Player key={player.id} player={player} />
  ));

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
