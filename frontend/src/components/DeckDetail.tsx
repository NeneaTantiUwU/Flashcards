import type { DeckDetailProps } from "../types";

export default function DeckDetail({ deck, onBack }: DeckDetailProps) {
  return (
    <div>
      <button onClick={onBack}>← Back</button>

      <h2>{deck.name}</h2>
      <p>{deck.cards.length} cards</p>

      {deck.cards.length === 0 ? (
        <p>This deck has no cards yet.</p>
      ) : (
        <ul>
          {deck.cards.map((card) => (
            <li key={card.id}>{card.front}</li>
          ))}
        </ul>
      )}
    </div>
  );
}