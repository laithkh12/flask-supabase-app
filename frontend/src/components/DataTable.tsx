import type { TableRow } from "@/types/table";
import styles from "./DataTable.module.css";

interface DataTableProps {
  rows: TableRow[];
  loading?: boolean;
}

const HIDDEN_COLUMNS = new Set(["id"]);

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export default function DataTable({ rows, loading }: DataTableProps) {
  if (loading) {
    return <p className={styles.message}>Loading table data...</p>;
  }

  if (rows.length === 0) {
    return <p className={styles.message}>This table has no rows.</p>;
  }

  const columns = Object.keys(rows[0]).filter((col) => !HIDDEN_COLUMNS.has(col));

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={String(row.id ?? index)}>
              {columns.map((column) => (
                <td key={column}>{formatValue(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
