import type { CardItemProps } from "../types";

export default function CardItem({ card, onDelete }: CardItemProps) {
  return (
    <li>
      <span className="card-text">
        <strong>{card.front}</strong>
        <span className="muted">Due {card.dueDate}</span>
      </span>
      <button onClick={() => onDelete(card.id)}>Delete</button>
    </li>
  );
}