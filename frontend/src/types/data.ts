type Card = {
  id: string;
  front: string;
  back: string;
  interval: number;          
  dueDate: string;      
};

type Deck = {
  id: string;
  name: string;
  cards: Card[];
};

type Rating = "hard" | "ok" | "easy";