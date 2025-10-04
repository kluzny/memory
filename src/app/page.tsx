"use client";

import { useRef, useEffect, useState } from "react";

import Setup from "@/app/components/setup";
import Players from "@/app/components/players";
import Board from "@/app/components/board";
import { Player, Card } from "@/types";
import generateCards from "@/utilities/deck-builder";
import { DebugContext } from "@/contexts/DebugContext";
import { Fireworks } from "@fireworks-js/react";
import type { FireworksHandlers } from "@fireworks-js/react";

import {
  MachineState,
  MachineStates,
  MachineActions,
  getNextState,
} from "@/types/states";

import { useSearchParams } from "next/navigation";

const DEBUG = false; // always false

function bigRandInt() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function randomArrayIndex(arr: unknown[]) {
  return Math.floor(Math.random() * arr.length);
}

const scaffoldPlayer: (name: string) => Player = (name: string) => {
  return {
    id: bigRandInt(),
    name: name,
    score: 0,
    matches: [],
  };
};

export default function Home() {
  const searchParams = useSearchParams();

  let isDebugging = false;
  if (searchParams.get("debug") || DEBUG) {
    isDebugging = true;
  }

  const [state, setState] = useState<MachineState>(MachineStates.setup);
  const [boardSize, setBoardSize] = useState<number>(4);
  const [playerData, setPlayerData] = useState<Player[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [initialPlayerOffset, setInitialPlayerOffset] = useState<number>(0);
  const [turn, setTurn] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [selections, setSelections] = useState<Card[]>([]);
  const [message, setMessage] = useState<string>("");
  const immutableRef = useRef(false);

  const fireworks = useRef<FireworksHandlers>(null);

  let topScore = 0;
  playerData.forEach((player) => {
    if (player.score > topScore) {
      topScore = player.score;
    }
  });

  const winners = playerData.filter((player) => player.score == topScore);
  const winnerList = winners.map((winner) => (
    <li key={winner.id}>{winner.name}</li>
  ));

  const addPlayer = (name: string) => {
    console.log(`adding player: ${name}`);
    setPlayerData((currentPlayerData) => [
      ...currentPlayerData,
      scaffoldPlayer(name),
    ]);
  };

  const nextPlayer = () => {
    const nextPlayerIndex = (turn + initialPlayerOffset) % playerData.length;
    return playerData[nextPlayerIndex];
  };

  const startGame = () => {
    console.log("startGame");
    setState((state) => getNextState(state, MachineActions.start));
    resetGame();
  };

  const win = () => {
    console.log("win");

    setState((state) => getNextState(state, MachineActions.finish));
  };

  const setupGame = () => {
    console.log("setupGame");
    setState((state) => getNextState(state, MachineActions.reset));
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

  const addMatchToPlayer = () => {
    if (!currentPlayer) return;

    currentPlayer.score += 1;

    selections.forEach((card) => {
      currentPlayer.matches.push(card);
      card.owner = currentPlayer; // TODO: animate cards leaving
      updateCard(card);
    });
  };

  const nextTurn = () => {
    setTurn((currentTurnCount) => currentTurnCount + 1);
    const _nextPlayer: Player = nextPlayer();
    setCurrentPlayer(_nextPlayer);
    setSelections([]);
    setMessage(`Choose a card ${_nextPlayer.name}`);
  };

  const goAgain = () => {
    setSelections([]);
    setMessage(`Choose a card ${currentPlayer?.name}`);
  };

  const resetBoard = () => {
    // TODO: animate flips
    selections.forEach((card: Card) => {
      card.flipped = false;
      updateCard(card);
    });
  };

  const flipCard = (card: Card) => {
    card.flipped = true;
    updateCard(card);
    setSelections([...selections, card]);
  };

  const randomizeStartingPlayer = () => {
    setInitialPlayerOffset(randomArrayIndex(playerData));
  };

  const resetPlayerScores = () => {
    playerData.forEach((player) => {
      player.score = 0;
      player.matches = [];
    });
  };

  const resetGame = () => {
    setTurn(0);
    resetPlayerScores();
    setCards(generateCards(boardSize));
    randomizeStartingPlayer();
    nextTurn();
  };

  const scaffoldPlayers = () => {
    addPlayer("twitchbot4000");
    addPlayer("jeanegrey");
  };

  useEffect(() => {
    const checkForMatch = () => {
      console.log({ selections });

      if (selections.length < 2) {
        immutableRef.current = false;
        return;
      }

      if (selections[0].value === selections[1].value) {
        setMessage("Match Found!");
        addMatchToPlayer();
        setTimeout(() => {
          immutableRef.current = false;
          goAgain();
        }, 2000);
      } else {
        setMessage("Sorry, No Match");
        setTimeout(() => {
          resetBoard();
          nextTurn();
          immutableRef.current = false;
        }, 2000);
      }
    };

    checkForMatch();
  }, [selections]);

  useEffect(() => {
    if (cards.length < 1 || state === MachineStates.win) {
      return;
    }

    const unclaimedCards = cards.filter((card) => card.owner === undefined);
    if (unclaimedCards.length == 0) {
      win();
    }
  }, [cards]);

  useEffect(() => {
    if (state != MachineStates.win) {
      if (fireworks.current && fireworks.current.isRunning) {
        fireworks.current.stop();
      }

      return;
    }

    if (fireworks.current && !fireworks.current.isRunning) {
      fireworks.current.start();
    }
  }, [state]);

  return (
    <DebugContext.Provider value={isDebugging}>
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        {state === MachineStates.win && (
          <Fireworks
            ref={fireworks}
            className="h-full w-full pointer-events-none absolute"
          />
        )}
        <nav className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 text-blue-700">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl my-4">Memory!</h1>
          <h2 className="italic text-lg sm:text-xl lg:text-2xl">
            A concentration game
          </h2>
        </nav>
        {isDebugging && (
          <div className="w-full mb-8 p-2 bg-[repeating-linear-gradient(45deg,_#facc15_0px,_#facc15_10px,_#000_10px,_#000_20px)]">
            <header className="bg-yellow-200 p-2 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <p className="text-sm sm:text-base">Turn: {turn}</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  className="border-2 border-black py-1 px-2 text-xs sm:text-sm"
                  onClick={scaffoldPlayers}
                >
                  Scaffold Players
                </button>
                <button
                  className="border-2 border-black py-1 px-2 text-xs sm:text-sm"
                  onClick={resetGame}
                >
                  Reset Game
                </button>
              </div>
            </header>
          </div>
        )}
        <div className="flex flex-col lg:flex-row w-full h-full space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="w-full lg:w-2/5 h-full bg-orange-100 rounded-md space-y-4 p-4">
            <div className="flex justify-between items-center"></div>
            <Players
              playerData={playerData}
              addPlayer={addPlayer}
              activePlayer={currentPlayer}
            />
          </div>
          <div className="w-full lg:w-3/5 bg-orange-100 rounded-md p-4">
            {state === MachineStates.setup && (
              <Setup
                playerCount={Object.keys(playerData).length}
                boardSize={boardSize}
                setBoardSize={setBoardSize}
                startGame={startGame}
              />
            )}
            {state === MachineStates.playing && (
              <>
                <header className="text-center text-lg sm:text-xl lg:text-2xl mb-4">
                  {message}
                </header>
                <Board
                  immutableRef={immutableRef}
                  boardSize={boardSize}
                  cards={cards}
                  flipCard={flipCard}
                />
              </>
            )}
            {state === MachineStates.win && (
              <div className="flex flex-col justify-center items-center h-full space-y-4 animate__animated animate__zoomIn">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl animate_animated animate_rotateIn">
                  Congratulations
                </h1>
                <ul className="text-4xl sm:text-6xl lg:text-8xl text-center animate__animated animate__pulse animate__infinite">
                  {winnerList}
                </ul>
                <h2 className="text-lg sm:text-xl lg:text-2xl">
                  You won with {topScore} Points.
                </h2>
                <button
                  className="px-4 py-2 border-2 border-blue-500 rounded-lg bg-white hover:bg-pink-200 hover:border-pink-500 text-sm sm:text-base"
                  onClick={setupGame}
                >
                  Play Again?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DebugContext.Provider>
  );
}
