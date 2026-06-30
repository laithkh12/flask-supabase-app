import Link from "next/link";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.brand}>
        Flask + Supabase
      </Link>
      <div className={styles.links}>
        <Link href="/">Items</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/tables">Database Tables</Link>
      </div>
    </nav>
  );
}
