import { Card } from "@/types";
import animateCSS from "@/utilities/animate-css";

interface StatefulCardProps {
  card: Card;
  flipCard: (card: Card) => void;
}

export default function StatefulCard({ card, flipCard }: StatefulCardProps) {
  const size = "h-24 w-24";
  const border = "rounded-lg border-4 border-black";
  const display = "flex justify-center items-center";
  const hover = "hover:scale-133";

  const animateCardFlip = (event: React.MouseEvent) => {
    const element = event.target as HTMLElement;
    animateCSS(element, "flipOutY").then(() => {
      flipCard(card);
    });
  };

  if (card.flipped) {
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
      ></button>
    );
  }
}
