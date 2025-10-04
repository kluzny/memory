import { Card } from "@/types";
import StatefulCard from "./stateful-card";
import type { RefObject } from "react";

interface BoardProps {
  immutableRef: RefObject<number>;
  cards: Card[];
  boardSize: number;
  flipCard: (card: Card) => void;
}

export default function Board({
  immutableRef,
  boardSize,
  cards,
  flipCard,
}: BoardProps) {
  // needed to inform tailwind which utility classes to dynamically build
  const tailwindIsSilly: Record<number, string> = {
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
  };

  const gridSize = tailwindIsSilly[boardSize];
  const cardComponents = cards.map((card) => {
    return (
      <StatefulCard
        immutableRef={immutableRef}
        key={card.key}
        card={card}
        flipCard={flipCard}
      />
    );
  });

  return (
    <div className="flex">
      <div className={`grid ${gridSize} gap-2 mx-auto`}>{cardComponents}</div>
    </div>
  );
}
