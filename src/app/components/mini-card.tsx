import { Card } from "@/types";

interface MiniCardProps {
  card: Card;
}

export default function MiniCard({ card }: MiniCardProps) {
  return (
    <div className="h-8 w-8 rounded-lg border-4 border-black flex justify-center items-center">
      {card.value}
    </div>
  );
}
