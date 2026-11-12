import type { DeckListProps } from "../types";

export default function DeckList({ decks }: DeckListProps) {
  if (decks.length === 0) {
    return <p>You don't have any deck yet.</p>;
  }

  return (
    <ul>
      {decks.map((deck) => (
        <li key={deck.id}>
          {deck.name} ({deck.cards.length} cards)
        </li>
      ))}
    </ul>
  );
}