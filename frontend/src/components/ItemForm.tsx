"use client";

import { FormEvent, useState } from "react";
import styles from "./ItemForm.module.css";

interface ItemFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
  disabled?: boolean;
  fieldLabel?: string;
  fieldPlaceholder?: string;
  submitLabel?: string;
}

export default function ItemForm({
  onSubmit,
  disabled,
  fieldLabel = "Title",
  fieldPlaceholder = "Enter a title",
  submitLabel = "Add Item",
}: ItemFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(title.trim(), description.trim());
      setTitle("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="title">{fieldLabel}</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={fieldPlaceholder}
          disabled={disabled || submitting}
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={3}
          disabled={disabled || submitting}
        />
      </div>
      <button type="submit" disabled={disabled || submitting || !title.trim()}>
        {submitting ? "Adding..." : submitLabel}
      </button>
    </form>
  );
}
