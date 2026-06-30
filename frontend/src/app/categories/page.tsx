"use client";

import { useCallback, useEffect, useState } from "react";
import CategoryList from "@/components/CategoryList";
import ItemForm from "@/components/ItemForm";
import {
  checkHealth,
  createCategory,
  deleteCategory,
  fetchCategories,
} from "@/lib/api";
import type { Category } from "@/types/category";
import styles from "./page.module.css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<"ok" | "error" | "checking">(
    "checking"
  );

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
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
      await loadCategories();
    }
    init();
  }, [loadCategories]);

  async function handleCreate(name: string, description: string) {
    setError(null);
    try {
      const category = await createCategory(name, description);
      setCategories((prev) => [category, ...prev]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category"
      );
      throw err;
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Categories</h1>
        <p className={styles.subtitle}>Add and manage categories in Supabase</p>
      </header>

      {error ? <div className={styles.error}>{error}</div> : null}

      <section className={styles.section}>
        <h2>Add Category</h2>
        <ItemForm
          onSubmit={handleCreate}
          disabled={apiStatus !== "ok"}
          fieldLabel="Name"
          fieldPlaceholder="Enter a category name"
          submitLabel="Add Category"
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>All Categories</h2>
          <button
            type="button"
            className={styles.refresh}
            onClick={loadCategories}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
        <CategoryList
          categories={categories}
          onDelete={handleDelete}
          loading={loading}
        />
      </section>
    </div>
  );
}
