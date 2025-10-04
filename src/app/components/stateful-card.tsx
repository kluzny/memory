import { Card } from "@/types";
import animateCSS from "@/utilities/animate-css";
import type { RefObject } from "react";
import { useContext } from "react";
import { DebugContext } from "@/contexts/DebugContext";

interface StatefulCardProps {
  immutableRef: RefObject<number>;
  card: Card;
  flipCard: (card: Card) => void;
}

export default function StatefulCard({
  immutableRef,
  card,
  flipCard,
}: StatefulCardProps) {
  const isDebug = useContext(DebugContext);

  const size = "h-24 w-24";
  const border = "rounded-lg border-4 border-black";
  const display = "flex justify-center items-center";
  const hover = "hover:scale-133";

  const animateCardFlip = (event: React.MouseEvent) => {
    const element = event.target as HTMLElement;
    if (immutableRef.current > 1) {
      console.log("immutable: ignoring input");
      return;
    } else {
      immutableRef.current++;
    }

    animateCSS(element, "flipOutY").then(() => {
      flipCard(card);
    });
  };

  if (card.owner || !card.dealt) {
    return (
      <div
        className={`${size} rounded-lg border-4 border-orange-200 bg-orange-200`}
      ></div>
    );
  } else if (card.flipped) {
    return (
      <button className={`${size} ${border} ${display} ${hover} bg-white`}>
        <p className="text-2xl">{card.value}</p>
      </button>
    );
  } else {
    return (
      <button
        className={`${size} ${border} ${display} ${hover} bg-violet-500 hover:bg-violet-600 hover:border-purple-300`}
        onClick={animateCardFlip}
      >
        {isDebug && <span className="text-sm">{card.value}</span>}
      </button>
    );
  }
}
