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
      <div className="done">
        <h2>All done for today!</h2>
        <p>You reviewed {queue.length} cards.</p>
        <button className="back-button" onClick={onBack}>← Back to deck</button>
      </div>
    );
  }

  const card = queue[index];

  return (
    <div>
      <div className="study-top">
        <button className="back-button" onClick={onBack}>← Back</button>
        <span className="muted">
          {deck.name}: card {index + 1} of {queue.length}
        </span>
      </div>

      <div className="study-card">
        <h2>{card.front}</h2>
        {showAnswer && <p className="study-answer">{card.back}</p>}
      </div>

      <div className="rating-buttons">
        {showAnswer ? (
          <>
            <button className="rate-hard" onClick={() => handleRate("hard")}>Hard</button>
            <button className="rate-ok" onClick={() => handleRate("ok")}>Ok</button>
            <button className="rate-easy" onClick={() => handleRate("easy")}>Easy</button>
          </>
        ) : (
          <button onClick={() => setShowAnswer(true)}>Show answer</button>
        )}
      </div>
    </div>
  );
}