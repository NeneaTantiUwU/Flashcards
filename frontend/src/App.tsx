import { useEffect, useState } from "react";
import type { Deck } from "./types";
import DeckList from "./components/DeckList";
import { API_URL } from "./config";

export default function App() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/decks`)
      .then((res) => res.json())
      .then((data: Deck[]) => setDecks(data))
      .catch(() => setError("Cannot connect to the server."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Flashcards</h1>
      <DeckList
        decks={decks}
        onOpen={() => {}}          
        onDeckAdded={() => {}}     
        onDeckDeleted={() => {}}   
      />
    </div>
  );
}
