export type NewDeck = {
  name: string;
};

export type NewCard = {
  front: string;
  back: string;
};

export type ReviewRequest = {
  rating: Rating;
};

export type ApiError = {
  error: string;
};