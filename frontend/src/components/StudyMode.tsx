import { useState } from "react";
import type { Card, Rating, StudyModeProps } from "../types";
import { API_URL } from "../config";

export default function StudyMode({ deck, onBack, onCardReviewed }: StudyModeProps) {
  const today = new Date().toLocaleDateString("en-CA");

  // the list of due cards is taken once, when the screen opens
  const [queue] = useState<Card[]>(() =>
    deck.cards.filter((c) => c.dueDate <= today)
  );
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleRate = async (rating: Rating) => {
    const card = queue[index];

    const res = await fetch(`${API_URL}/cards/${card.id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });

    if (!res.ok) {
      alert("Could not save the review.");
      return;
    }

    const updated: Card = await res.json();
    onCardReviewed(updated);
    setShowAnswer(false);
    setIndex((i) => i + 1);
  };

  if (index >= queue.length) {
    return (
      <div>
        <h2>All done for today!</h2>
        <p>You reviewed {queue.length} cards.</p>
        <button onClick={onBack}>← Back to deck</button>
      </div>
    );
  }

  const card = queue[index];

  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <p>
        {deck.name}: card {index + 1} of {queue.length}
      </p>

      <h2>{card.front}</h2>

      {showAnswer ? (
        <>
          <p>{card.back}</p>
          <button onClick={() => handleRate("hard")}>Hard</button>
          <button onClick={() => handleRate("ok")}>Ok</button>
          <button onClick={() => handleRate("easy")}>Easy</button>
        </>
      ) : (
        <button onClick={() => setShowAnswer(true)}>Show answer</button>
      )}
    </div>
  );
}