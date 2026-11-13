import { useEffect, useState } from "react";
import type { Deck, View } from "./types";
import DeckList from "./components/DeckList";
import { API_URL } from "./config";
import DeckDetail from "./components/DeckDetail";

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

  const goToDecks = () => setView({ screen: "decks" });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

if (view.screen === "deckDetail") {
    const selectedDeck = decks.find((d) => d.id === view.deckId);

    if (!selectedDeck) {
      return (
        <div>
          <p>Deck not found.</p>
          <button onClick={goToDecks}>← Back</button>
        </div>
      );
    }

    return (
      <DeckDetail
        deck={selectedDeck}
        onBack={goToDecks}
        onStudy={() => {}}  
        onDeckChange={handleDeckChange}
      />
    );
  }

  return (
    <div>
      <h1>Flashcards</h1>
      <DeckList
        decks={decks}
        onOpen={() => {}}          
        onDeckAdded= {handleDeckAdded}     
        onDeckDeleted={handleDeckDeleted}   
      />
    </div>
  );
}
