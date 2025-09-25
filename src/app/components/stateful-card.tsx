import { Card } from "@/types";

interface StatefulCardProps {
  card: Card;
  clickCard: (event: React.MouseEvent, card: Card) => void;
}

export default function StatefulCard({ card, clickCard }: StatefulCardProps) {
  const size = "h-24 w-24";
  const border = "rounded-lg border-4 border-black";
  const display = "flex justify-center items-center";

  if (card.flipped) {
    return (
      <button className={`${size} ${border} ${display} bg-white`}>
        <p className="text-2xl">{card.value}</p>
      </button>
    );
  } else {
    return (
      <button
        className={`${size} ${border} ${display} bg-violet-500`}
        onClick={(event) => clickCard(event, card)}
      ></button>
    );
  }
}
