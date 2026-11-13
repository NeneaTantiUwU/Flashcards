import { useState } from "react";
import type { Card, DeckDetailProps } from "../types";
import { API_URL } from "../config";
import CardItem from "./CardItem";

export default function DeckDetail({ deck, onBack, onStudy, onDeckChange }: DeckDetailProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const today = new Date().toLocaleDateString("en-CA"); // "2026-11-13"
  const dueCount = deck.cards.filter((c) => c.dueDate <= today).length;

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!front.trim() || !back.trim()) return;

    const res = await fetch(`${API_URL}/decks/${deck.id}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ front, back }),
    });

    if (!res.ok) {
      alert("Could not add the card.");
      return;
    }

    const card: Card = await res.json();
    onDeckChange({ ...deck, cards: [...deck.cards, card] });
    setFront("");
    setBack("");
  };

  const handleDeleteCard = async (cardId: string) => {
    const res = await fetch(`${API_URL}/cards/${cardId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Could not delete the card.");
      return;
    }

    onDeckChange({ ...deck, cards: deck.cards.filter((c) => c.id !== cardId) });
  };

  return (
    <div>
      <button onClick={onBack}>← Back</button>

      <h2>{deck.name}</h2>
      <p>
        {deck.cards.length} cards, {dueCount} due today
      </p>
      <button onClick={onStudy} disabled={dueCount === 0}>
        Study
      </button>

      <h3>Add a card</h3>
      <form onSubmit={handleAddCard}>
        <input
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Question"
        />
        <input
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Answer"
        />
        <button type="submit">Add</button>
      </form>

      <h3>Cards</h3>
      {deck.cards.length === 0 ? (
        <p>This deck has no cards yet.</p>
      ) : (
        <ul>
          {deck.cards.map((card) => (
            <CardItem key={card.id} card={card} onDelete={handleDeleteCard} />
          ))}
        </ul>
      )}
    </div>
  );
}