"use client";

import type { Category } from "@/types/category";
import styles from "./CategoryList.module.css";

interface CategoryListProps {
  categories: Category[];
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}

export default function CategoryList({
  categories,
  onDelete,
  loading,
}: CategoryListProps) {
  if (loading) {
    return <p className={styles.message}>Loading categories...</p>;
  }

  if (categories.length === 0) {
    return <p className={styles.message}>No categories yet. Add one above.</p>;
  }

  return (
    <ul className={styles.list}>
      {categories.map((category) => (
        <li key={category.id} className={styles.item}>
          <div className={styles.content}>
            <h3>{category.name}</h3>
            {category.description ? <p>{category.description}</p> : null}
            <time dateTime={category.created_at}>
              {new Date(category.created_at).toLocaleString()}
            </time>
          </div>
          <button
            type="button"
            className={styles.delete}
            onClick={() => onDelete(category.id)}
            aria-label={`Delete ${category.name}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
