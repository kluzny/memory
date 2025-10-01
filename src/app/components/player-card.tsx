import { Player } from "@/types";
import MiniCard from "./mini-card";

interface PlayerCardProps {
  player: Player;
  active: boolean;
}

const activeClasses = "border-4 border-pink-500 rounded-lg";
const inactiveClasses = "border-4 border-blue-700 rounded-lg";

export default function PlayerCard({ player, active }: PlayerCardProps) {
  const miniCards = player.matches.map((card) => (
    <MiniCard key={card.key} card={card} />
  ));

  return (
    <div
      className={
        "p-4 rounded-md bg-blue-500 " +
        (active ? activeClasses : inactiveClasses)
      }
    >
      <div className="flex justify-between items-center mb-4 text-white">
        <h2 className="text-3xl underline decoration-dashed">{player.name}</h2>
        <p className="text-2xl">Score: {player.score}</p>
      </div>

      <div className="grid grid-cols-8 gap-4">{miniCards}</div>
    </div>
  );
}
