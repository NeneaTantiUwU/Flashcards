import type { CardItemProps } from "../types";

export default function CardItem({ card, onDelete }: CardItemProps) {
  return (
    <li>
      <strong>{card.front}</strong> (due {card.dueDate})
      <button onClick={() => onDelete(card.id)}>Delete</button>
    </li>
  );
}