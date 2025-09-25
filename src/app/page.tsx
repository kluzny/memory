"use client";

import { useState } from "react";

import Setup from "@/app/components/setup";
import Players from "@/app/components/players";
import { Player } from "@/types";

enum MachineStates {
  setup = "setup",
  playing = "playing",
  win = "win",
}

enum MachineActions {
  configure = "configure",
  start = "start",
  finish = "finish",
  reset = "reset",
}

type MachineState = keyof typeof MachineStates;
type MachineAction = keyof typeof MachineActions;

type StateMachine = {
  [state in MachineStates]: {
    [action in MachineActions]?: MachineState;
  };
};

const stateMachine: StateMachine = {
  [MachineStates.setup]: {
    [MachineActions.start]: MachineStates.playing,
  },
  [MachineStates.playing]: {
    [MachineActions.finish]: MachineStates.win,
    [MachineActions.reset]: MachineStates.setup,
  },
  [MachineStates.win]: {
    [MachineActions.reset]: MachineStates.setup,
  },
};

const getNextState = (state: MachineState, action: MachineAction) => {
  const newState = stateMachine[state][action];

  if (!newState) {
    throw new Error(`${action} is not a valid step from ${state}`);
  }

  return newState;
};

function bigRandInt() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

const scaffoldPlayer: (name: string) => Player = (name: string) => {
  return {
    id: bigRandInt(),
    name: name,
    score: 0,
    active: false,
  };
};

export default function Home() {
  const [state, setState] = useState<MachineState>(MachineStates.setup);
  const [boardSize, setBoardSize] = useState<number>(4);
  const [playerData, setPlayerData] = useState<Player[]>([]);

  const addPlayer = (name: string) => {
    console.log(`adding player: ${name}`);
    setPlayerData([...playerData, scaffoldPlayer(name)]);
  };

  return (
    <div className="container mx-auto">
      <nav className="flex items-baseline justify-center space-x-2 text-blue-700">
        <h1 className="text-6xl my-4">Memory!</h1>
        <h2 className="italic text-2xl">A concentration game</h2>
      </nav>
      <div className="flex w-full h-full space-x-4">
        <div className="w-2/5 h-full bg-orange-100 rounded-md space-y-4 p-4">
          <Players playerData={playerData} addPlayer={addPlayer} />
        </div>
        <div className="w-3/5 bg-orange-100 rounded-md p-4">
          {state === MachineStates.setup && (
            <Setup
              playerCount={Object.keys(playerData).length}
              boardSize={boardSize}
              setBoardSize={setBoardSize}
            />
          )}
        </div>
      </div>
    </div>
  );
}
