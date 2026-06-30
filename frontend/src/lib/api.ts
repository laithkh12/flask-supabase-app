import type { Category } from "@/types/category";
import type { Item } from "@/types/item";
import type { TableInfo, TableRow } from "@/types/table";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error ?? "Request failed");
  }

  return body;
}

export async function checkHealth(): Promise<{ status: string; service: string }> {
  return request("/api/health");
}

export async function fetchItems(): Promise<Item[]> {
  const result = await request<{ data: Item[] }>("/api/items");
  return result.data;
}

export async function createItem(
  title: string,
  description: string
): Promise<Item> {
  const result = await request<{ data: Item }>("/api/items", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
  return result.data;
}

export async function deleteItem(id: string): Promise<void> {
  await request(`/api/items/${id}`, { method: "DELETE" });
}

export async function fetchCategories(): Promise<Category[]> {
  const result = await request<{ data: Category[] }>("/api/categories");
  return result.data;
}

export async function createCategory(
  name: string,
  description: string
): Promise<Category> {
  const result = await request<{ data: Category }>("/api/categories", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
  return result.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await request(`/api/categories/${id}`, { method: "DELETE" });
}

export async function fetchTables(): Promise<TableInfo[]> {
  const result = await request<{ data: TableInfo[] }>("/api/tables");
  return result.data;
}

export async function fetchTableData(
  tableName: string
): Promise<{ table: string; data: TableRow[] }> {
  return request(`/api/tables/${tableName}`);
}
