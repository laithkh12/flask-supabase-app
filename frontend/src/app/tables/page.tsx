"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTables } from "@/lib/api";
import type { TableInfo } from "@/types/table";
import styles from "./page.module.css";

export default function TablesPage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTables();
        setTables(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tables");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Database Tables</h1>
        <p className={styles.subtitle}>
          Browse tables from your Supabase database
        </p>
      </header>

      {error ? <div className={styles.error}>{error}</div> : null}

      {loading ? (
        <p className={styles.message}>Loading tables...</p>
      ) : tables.length === 0 ? (
        <p className={styles.message}>No tables available.</p>
      ) : (
        <ul className={styles.list}>
          {tables.map((table) => (
            <li key={table.name}>
              <Link href={`/tables/${table.name}`} className={styles.card}>
                <div>
                  <h2>{table.name}</h2>
                  <p>{table.row_count} row{table.row_count !== 1 ? "s" : ""}</p>
                </div>
                <span className={styles.arrow}>View →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
