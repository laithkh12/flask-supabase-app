export interface TableInfo {
  name: string;
  row_count: number;
  order_by: string | null;
}

export type TableRow = Record<string, unknown>;
