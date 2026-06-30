"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DataTable from "@/components/DataTable";
import { fetchTableData } from "@/lib/api";
import type { TableRow } from "@/types/table";
import styles from "./page.module.css";

export default function TableDetailPage() {
  const params = useParams<{ table: string }>();
  const tableName = params.table;

  const [rows, setRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTableData(tableName);
        setRows(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load table");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tableName]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/tables" className={styles.back}>
          ← All tables
        </Link>
        <h1>{tableName}</h1>
        <p className={styles.subtitle}>
          {loading ? "Loading..." : `${rows.length} row${rows.length !== 1 ? "s" : ""}`}
        </p>
      </header>

      {error ? <div className={styles.error}>{error}</div> : null}

      <DataTable rows={rows} loading={loading} />
    </div>
  );
}
