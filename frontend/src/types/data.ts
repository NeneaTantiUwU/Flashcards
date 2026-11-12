export type Card = {
  id: string;
  front: string;
  back: string;
  interval: number;          
  dueDate: string;      
};

export type Deck = {
  id: string;
  name: string;
  cards: Card[];
};

export type Rating = "hard" | "ok" | "easy";