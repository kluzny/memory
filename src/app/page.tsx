"use client";

import { useRef, useEffect, useState, useReducer, useCallback } from "react";

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

interface GameState {
  selections: Card[];
  isProcessing: boolean;
  message: string;
}

type GameAction =
  | { type: "SELECT_CARD"; card: Card }
  | { type: "CLEAR_SELECTIONS" }
  | { type: "SET_PROCESSING"; isProcessing: boolean }
  | { type: "SET_MESSAGE"; message: string }
  | { type: "RESET_TURN" };

function gameStateReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SELECT_CARD":
      if (state.isProcessing || state.selections.length >= 2) {
        return state;
      }
      return {
        ...state,
        selections: [...state.selections, action.card],
      };
    case "CLEAR_SELECTIONS":
      return {
        ...state,
        selections: [],
        isProcessing: false,
      };
    case "SET_PROCESSING":
      return {
        ...state,
        isProcessing: action.isProcessing,
      };
    case "SET_MESSAGE":
      return {
        ...state,
        message: action.message,
      };
    case "RESET_TURN":
      return {
        ...state,
        selections: [],
        isProcessing: false,
      };
    default:
      return state;
  }
}

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
  const [gameState, dispatch] = useReducer(gameStateReducer, {
    selections: [],
    isProcessing: false,
    message: "",
  });

  const fireworks = useRef<FireworksHandlers>(null);
  const immutableRef = useRef(gameState.isProcessing);

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

  const nextPlayer = useCallback(() => {
    const nextPlayerIndex = (turn + initialPlayerOffset) % playerData.length;
    return playerData[nextPlayerIndex];
  }, [turn, initialPlayerOffset, playerData]);

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

  const updateCard = useCallback((updatedCard: Card) => {
    setCards((currentCards) =>
      currentCards.map((card) => {
        if (card.key == updatedCard.key) {
          return updatedCard;
        } else {
          return card;
        }
      })
    );
  }, []);

  const addMatchToPlayer = useCallback(() => {
    if (!currentPlayer) return;

    currentPlayer.score += 1;

    gameState.selections.forEach((card) => {
      currentPlayer.matches.push(card);
      card.owner = currentPlayer; // TODO: animate cards leaving
      updateCard(card);
    });
  }, [currentPlayer, gameState.selections, updateCard]);

  const nextTurn = useCallback(() => {
    setTurn((currentTurnCount) => currentTurnCount + 1);
    const _nextPlayer: Player = nextPlayer();
    setCurrentPlayer(_nextPlayer);
    dispatch({ type: "RESET_TURN" });
    dispatch({
      type: "SET_MESSAGE",
      message: `Choose a card ${_nextPlayer.name}`,
    });
  }, [nextPlayer]);

  const goAgain = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTIONS" });
    dispatch({
      type: "SET_MESSAGE",
      message: `Choose a card ${currentPlayer?.name}`,
    });
  }, [currentPlayer]);

  const resetBoard = useCallback(() => {
    // TODO: animate flips
    gameState.selections.forEach((card: Card) => {
      card.flipped = false;
      updateCard(card);
    });
  }, [gameState.selections, updateCard]);

  const flipCard = useCallback(
    (card: Card) => {
      if (gameState.isProcessing || gameState.selections.length >= 2) {
        return;
      }

      card.flipped = true;
      updateCard(card);
      dispatch({ type: "SELECT_CARD", card });
    },
    [gameState.isProcessing, gameState.selections.length, updateCard]
  );

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
      console.log({ selections: gameState.selections });

      if (gameState.selections.length < 2) {
        return;
      }

      dispatch({ type: "SET_PROCESSING", isProcessing: true });

      if (gameState.selections[0].value === gameState.selections[1].value) {
        dispatch({ type: "SET_MESSAGE", message: "Match Found!" });
        addMatchToPlayer();
        setTimeout(() => {
          goAgain();
        }, 400);
      } else {
        dispatch({ type: "SET_MESSAGE", message: "Sorry, No Match" });
        setTimeout(() => {
          resetBoard();
          nextTurn();
        }, 600);
      }
    };

    checkForMatch();
  }, [gameState.selections, addMatchToPlayer, goAgain, resetBoard, nextTurn]);

  useEffect(() => {
    if (cards.length < 1 || state === MachineStates.win) {
      return;
    }

    const unclaimedCards = cards.filter((card) => card.owner === undefined);
    if (unclaimedCards.length == 0) {
      win();
    }
  }, [cards, state]);

  useEffect(() => {
    immutableRef.current = gameState.isProcessing;
  }, [gameState.isProcessing]);

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
      <div className="container mx-auto">
        {state === MachineStates.win && (
          <Fireworks
            ref={fireworks}
            className="h-full w-full pointer-events-none absolute"
          />
        )}
        <nav className="flex items-baseline justify-center space-x-2 text-blue-700">
          <h1 className="text-6xl my-4">Memory!</h1>
          <h2 className="italic text-2xl">A concentration game</h2>
        </nav>
        {isDebugging && (
          <div className="w-full mb-8 p-2 bg-[repeating-linear-gradient(45deg,_#facc15_0px,_#facc15_10px,_#000_10px,_#000_20px)]">
            <header className="bg-yellow-200 p-2 flex justify-between items-center">
              <p>Turn: {turn}</p>
              <button
                className="border-2 border-black py-1 px-2"
                onClick={scaffoldPlayers}
              >
                Scaffold Players
              </button>
              <button
                className="border-2 border-black py-1 px-2"
                onClick={resetGame}
              >
                Reset Game
              </button>
            </header>
          </div>
        )}
        <div className="flex w-full h-full space-x-4">
          <div className="w-2/5 h-full bg-orange-100 rounded-md space-y-4 p-4">
            <div className="flex justify-between items-center"></div>
            <Players
              playerData={playerData}
              addPlayer={addPlayer}
              activePlayer={currentPlayer}
            />
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
              <>
                <header className="text-center text-2xl mb-4">
                  {gameState.message}
                </header>
                <Board
                  immutableRef={immutableRef}
                  boardSize={boardSize}
                  cards={cards}
                  flipCard={flipCard}
                  canSelect={
                    !gameState.isProcessing && gameState.selections.length < 2
                  }
                />
              </>
            )}
            {state === MachineStates.win && (
              <div className="flex flex-col justify-center items-center h-full space-y-4 animate__animated animate__zoomIn">
                <h1 className="text-4xl animate_animated animate_rotateIn">
                  Congratulations
                </h1>
                <ul className="text-8xl text-center animate__animated animate__pulse animate__infinite">
                  {winnerList}
                </ul>
                <h2 className="text-2xl">You won with {topScore} Points.</h2>
                <button
                  className="px-4 py-2 border-2 border-blue-500 rounded-lg bg-white hover:bg-pink-200 hover:border-pink-500"
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
