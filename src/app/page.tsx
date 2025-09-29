"use client";

import { useState } from "react";

import Setup from "@/app/components/setup";
import Players from "@/app/components/players";
import Board from "@/app/components/board";
import { Player, Card } from "@/types";

// TODO: move state machine stuff out to another file
enum MachineStates {
  setup = "setup",
  playing = "playing",
  win = "win",
}

enum MachineActions {
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

const scaffoldCard: (value: string, key: number) => Card = (
  value: string,
  key: number
) => {
  return {
    value: value,
    key: key,
    found: false,
    flipped: false,
  };
};

export default function Home() {
  const [state, setState] = useState<MachineState>(MachineStates.setup);
  const [boardSize, setBoardSize] = useState<number>(4);
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  const addPlayer = (name: string) => {
    console.log(`adding player: ${name}`);
    setPlayerData([...playerData, scaffoldPlayer(name)]);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shuffleArray = (arr: Array<any>) => {
    arr.sort(() => Math.random() - 0.5);
  };

  const generateCards = () => {
    // generate M pairs from a NxN where N is the boardSize
    // for odd N^2, subtract 1 to get an even number of pairs
    let numberOfCards = boardSize * boardSize;
    if (numberOfCards % 2 == 1) {
      numberOfCards -= 1;
    }
    const numberOfPairs = numberOfCards / 2;

    const newCards: Card[] = [];

    for (let i = 0; i < numberOfPairs; i++) {
      newCards.push(scaffoldCard(i.toString(), 2 * i));
      newCards.push(scaffoldCard(i.toString(), 2 * i + 1));
    }

    shuffleArray(newCards);
    setCards(newCards);
  };

  const startGame = () => {
    console.log("starting game");
    generateCards();
    setState((state) => getNextState(state, MachineActions.start));
  };

  const updateCard = (updatedCard: Card) => {
    const newCards = cards.map((card) => {
      if (card.key == updatedCard.key) {
        return updatedCard;
      } else {
        return card;
      }
    });

    setCards(newCards);
  };

  const flipCard = (card: Card) => {
    card.flipped = true;

    updateCard(card);
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
              startGame={startGame}
            />
          )}
          {state === MachineStates.playing && (
            <Board boardSize={boardSize} cards={cards} flipCard={flipCard} />
          )}
        </div>
      </div>
    </div>
  );
}
