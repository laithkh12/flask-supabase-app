"use client";

import type { Item } from "@/types/item";
import styles from "./ItemList.module.css";

interface ItemListProps {
  items: Item[];
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export default function ItemList({ items, onDelete, loading }: ItemListProps) {
  if (loading) {
    return <p className={styles.message}>Loading items...</p>;
  }

  if (items.length === 0) {
    return <p className={styles.message}>No items yet. Add one above.</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          <div className={styles.content}>
            <h3>{item.title}</h3>
            {item.description ? <p>{item.description}</p> : null}
            <time dateTime={item.created_at}>
              {new Date(item.created_at).toLocaleString()}
            </time>
          </div>
          <button
            type="button"
            className={styles.delete}
            onClick={() => onDelete(item.id)}
            aria-label={`Delete ${item.title}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
