import styles from './DashboardOverview.module.css';

export default function DashboardOverview() {
  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Overview</p>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.description}>
          Ringkasan performa inventory dan operasional harian dalam satu tampilan cepat.
        </p>
      </header>

      <div className={styles.grid}>
        <article className={styles.card}>
          <p className={styles.label}>Total Revenue</p>
          <p className={styles.value}>Rp 126.500.000</p>
        </article>
        <article className={styles.card}>
          <p className={styles.label}>Items Sold (30d)</p>
          <p className={styles.value}>2.148</p>
        </article>
        <article className={styles.card}>
          <p className={styles.label}>Low Stock Alerts</p>
          <p className={styles.value}>8</p>
        </article>
      </div>
    </section>
  );
}
