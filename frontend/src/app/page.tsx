"use client";

import { useCallback, useEffect, useState } from "react";
import ItemForm from "@/components/ItemForm";
import ItemList from "@/components/ItemList";
import {
  checkHealth,
  createItem,
  deleteItem,
  fetchItems,
} from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Item } from "@/types/item";
import styles from "./page.module.css";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"ok" | "error" | "checking">(
    "checking"
  );

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        await checkHealth();
        setApiStatus("ok");
      } catch {
        setApiStatus("error");
      }
      await loadItems();
    }
    init();
  }, [loadItems]);

  async function handleCreate(title: string, description: string) {
    setError(null);
    try {
      const item = await createItem(title, description);
      setItems((prev) => [item, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create item");
      throw err;
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Flask + Next.js + Supabase</h1>
          <p className={styles.subtitle}>
            Full-stack demo with a Flask API and Supabase database
          </p>
        </div>
        <div className={styles.badges}>
          <span
            className={`${styles.badge} ${
              apiStatus === "ok"
                ? styles.badgeOk
                : apiStatus === "error"
                  ? styles.badgeError
                  : styles.badgePending
            }`}
          >
            Flask API: {apiStatus === "checking" ? "..." : apiStatus}
          </span>
          <span
            className={`${styles.badge} ${
              isSupabaseConfigured() ? styles.badgeOk : styles.badgeError
            }`}
          >
            Supabase client: {isSupabaseConfigured() ? "configured" : "missing"}
          </span>
        </div>
      </header>

      {error ? <div className={styles.error}>{error}</div> : null}

      <section className={styles.section}>
        <h2>Add Item</h2>
        <ItemForm onSubmit={handleCreate} disabled={apiStatus !== "ok"} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Items</h2>
          <button
            type="button"
            className={styles.refresh}
            onClick={loadItems}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
        <ItemList items={items} onDelete={handleDelete} loading={loading} />
      </section>
    </div>
  );
}
