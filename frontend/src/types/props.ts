export type DeckListProps = {
  decks: Deck[];
  onOpen: (deckId: string) => void;
  onDeckAdded: (deck: Deck) => void;
  onDeckDeleted: (deckId: string) => void;
};

export type DeckDetailProps = {
  deck: Deck;
  onBack: () => void;
  onStudy: () => void;
  onDeckChange: (deck: Deck) => void;
};

export type StudyModeProps = {
  deck: Deck;
  onBack: () => void;
  onCardReviewed: (card: Card) => void;
};

export type CardItemProps = {
  card: Card;
  onDelete: (cardId: string) => void;
};