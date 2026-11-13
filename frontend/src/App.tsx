import { useEffect, useState } from "react";
import type { Card, Deck, View } from "./types";
import DeckList from "./components/DeckList";
import { API_URL } from "./config";
import "./App.css";
import DeckDetail from "./components/DeckDetail";
import StudyMode from "./components/StudyMode";

export default function App() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const [view, setView] = useState<View>({ screen: "decks" });

  useEffect(() => {
    fetch(`${API_URL}/decks`)
      .then((res) => res.json())
      .then((data: Deck[]) => setDecks(data))
      .catch(() => setError("Cannot connect to the server."))
      .finally(() => setLoading(false));
  }, []);

  const handleDeckAdded = (deck: Deck) => {
  setDecks((prev) => [...prev, deck]);
};

const handleDeckDeleted = (deckId: string) => {
  setDecks((prev) => prev.filter((d) => d.id !== deckId));
};

 const handleDeckChange = (updated: Deck) => {
    setDecks((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleCardReviewed = (updated: Card) => {
  setDecks((prev) =>
    prev.map((d) => ({
      ...d,
      cards: d.cards.map((c) => (c.id === updated.id ? updated : c)),
    }))
  );
};

  const goToDecks = () => setView({ screen: "decks" });

  if (loading) return <p className="status">Loading...</p>;
  if (error) return <p className="status">{error}</p>;

if (view.screen === "study") {
  const studyDeck = decks.find((d) => d.id === view.deckId);

  if (!studyDeck) {
    return (
      <div>
        <p className="status">Deck not found.</p>
        <button className="back-button" onClick={goToDecks}>← Back</button>
      </div>
    );
  }

  return (
    <StudyMode
      deck={studyDeck}
      onBack={() => setView({ screen: "deckDetail", deckId: studyDeck.id })}
      onCardReviewed={handleCardReviewed}
    />
  );
}

if (view.screen === "deckDetail") {
    const selectedDeck = decks.find((d) => d.id === view.deckId);

    if (!selectedDeck) {
      return (
        <div>
          <p className="status">Deck not found.</p>
          <button className="back-button" onClick={goToDecks}>← Back</button>
        </div>
      );
    }

    return (
      <DeckDetail
        deck={selectedDeck}
        onBack={goToDecks}
        onStudy={() => setView({ screen: "study", deckId: selectedDeck.id })}  
        onDeckChange={handleDeckChange}
      />
    );
  }

  return (
    <div>
      <h1>Flashcards</h1>
      <DeckList
        decks={decks}
        onOpen={(deckId) => setView({ screen: "deckDetail", deckId })}          
        onDeckAdded= {handleDeckAdded}     
        onDeckDeleted={handleDeckDeleted}   
      />
    </div>
  );
}
