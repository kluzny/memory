import { Card } from "@/types";

const scaffoldCard: (value: string, key: number) => Card = (
  value: string,
  key: number
) => {
  return {
    value: value,
    key: key,
    flipped: false,
  };
};

export default function generateCards(boardSize: number) {
  console.log("generating cards");

  // generate M pairs from a NxN where N is the boardSize
  // for odd N^2, subtract 1 to get an even number of pairs
  let numberOfCards = boardSize * boardSize;
  if (numberOfCards % 2 == 1) {
    numberOfCards -= 1;
  }
  const numberOfPairs = numberOfCards / 2;
  const cards: Card[] = [];

  for (let i = 0; i < numberOfPairs; i++) {
    cards.push(scaffoldCard(i.toString(), 2 * i));
    cards.push(scaffoldCard(i.toString(), 2 * i + 1));
  }

  cards.sort(() => Math.random() - 0.5); // shuffle

  return cards;
}
