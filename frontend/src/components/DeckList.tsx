import { useState } from "react";
import type { Deck, DeckListProps } from "../types";
import { API_URL } from "../config";

export default function DeckList({ decks, onOpen, onDeckAdded, onDeckDeleted }: DeckListProps) {
  const [name, setName] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim()) return;

  const res = await fetch(`${API_URL}/decks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    alert("Could not add the deck in list.");
    return;
  }

  const deck: Deck = await res.json();
  onDeckAdded(deck);
  setName("");
};

  const handleDelete = async (deckId: string) => {
     const res = await fetch(`${API_URL}/decks/${deckId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    alert("Could not delete the deck from list.");
    return;
  }

  onDeckDeleted(deckId);
  };

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New deck name"
        />
        <button type="submit">Add</button>
      </form>

      {decks.length === 0 ? (
        <p>You have no decks yet.</p>
      ) : (
        <ul>
          {decks.map((deck) => (
            <li key={deck.id}>
             <span className="deck-name" onClick={() => onOpen(deck.id)}>
                {deck.name}
                <span className="muted">{deck.cards.length} cards</span>
              </span>
              <button onClick={() => handleDelete(deck.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}