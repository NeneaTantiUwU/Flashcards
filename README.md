# Flashcards

A simple flashcard app for everyday learning and memorization. You can make decks of cards on any topic, such as vocabulary, formulas, dates or definitions, and review them a few minutes a day so what you learn sticks.

## How it works

1. **Deck list.** When you open the app, you see all your decks. Each one shows how many cards it has and how many are due today, for example "Web Exam (12 cards, 4 due today)".
2. **Create or open a deck.** Make a new deck, or open an existing one.
3. **Add cards.** Each card has a question (front) and an answer (back).
4. **Study.** Press **Study**. The app only shows the cards that are due today.
5. **Review each card.** You see the question, press **Show answer**, then rate how well you knew it: **Hard**, **Ok** or **Easy**.
6. **Schedule.** Based on your rating, the app works out when the card should come back, then moves to the next card.
7. **Done.** When there are no more cards due today, the app shows "Done for today!".

## Planned features

### Decks

- Deck list showing the total cards and the cards due today for each deck
- Create, open, edit and delete decks

### Cards

- Add, edit and delete cards, each with a question and an answer

### Study

- **Study** starts a session with only the cards due today
- Show the question first, then the answer after **Show answer**
- Rate each card Hard / Ok / Easy
- Work out the card's next review date from the rating, then go to the next card
- Show "Done for today!" when no cards are left for today

### Storage

- Save decks, cards and review dates to JSON files through the Python backend

## Tech stack

- **[TypeScript](https://www.typescriptlang.org/) + [React](https://react.dev/)**: the frontend
- **[Python](https://www.python.org/)**: the backend API that loads and saves data, using only the standard library (no frameworks or extra packages)
- **JSON files** instead of a database: decks, cards and review dates are stored as plain `.json` files in `backend/data/`, so they're easy to read, edit by hand, back up and share
