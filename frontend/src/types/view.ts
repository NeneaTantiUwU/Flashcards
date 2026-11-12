export type View =
  | { screen: "decks" }
  | { screen: "deckDetail"; deckId: string }
  | { screen: "study"; deckId: string };