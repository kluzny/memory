"use client";

import { useState } from "react";

import Player from "@/app/components/player";
import Board from "@/app/components/board";
import BoardSizePicker from "./components/board-size-picker";

function bigRandInt() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

const playerData = [
  {
    id: bigRandInt(),
    name: "Ada",
    score: 13,
    active: true,
  },
  {
    id: bigRandInt(),
    name: "Alan",
    score: 11,
    active: false,
  },
  {
    id: bigRandInt(),
    name: "twitchbot4000",
    score: 0,
    active: false,
  },
];

const players = playerData.map((player) => (
  <Player key={player.id} player={player} />
));

export default function Home() {
  const [boardSize, setBoardSize] = useState(0);

  return (
    <div className="container mx-auto">
      <div className="flex items-baseline justify-center space-x-2 text-slate-600">
        <h1 className="text-4xl my-4">Memory!</h1>
        <h2 className="italic">A concentration game</h2>
      </div>
      <div className="flex w-full h-full space-x-4">
        <div className="w-2/5 h-full bg-orange-100 rounded-md space-y-4 p-4">
          <div className="flex flex-col">{players}</div>
        </div>
        <div className="w-3/5 bg-red-500 p-8">
          <BoardSizePicker setBoardSize={setBoardSize} />
          <p className="text-8xl">Le Size: {boardSize}</p>
          <Board />
        </div>
      </div>
    </div>
  );
}
