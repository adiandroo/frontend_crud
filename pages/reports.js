import DashboardLayout from '../components/layout/DashboardLayout';
import styles from '../styles/ReportsPage.module.css';

const kpis = [
  { label: 'Net Revenue', value: 'Rp 126.500.000', delta: '+12.4%' },
  { label: 'Gross Margin', value: '32.8%', delta: '+2.1%' },
  { label: 'Avg Order Value', value: 'Rp 214.000', delta: '+6.5%' },
  { label: 'Return Rate', value: '1.9%', delta: '-0.4%' }
];

const topItems = [
  { name: 'USB-C Fast Charger 30W', sold: 418, revenue: 'Rp 60.610.000' },
  { name: 'Wireless Mouse Pro', sold: 325, revenue: 'Rp 38.675.000' },
  { name: 'Smart LED Bulb 12W', sold: 289, revenue: 'Rp 17.051.000' },
  { name: 'Keyboard Mechanical Lite', sold: 214, revenue: 'Rp 28.034.000' }
];

const categoryPerformance = [
  { category: 'Accessories', progress: 92 },
  { category: 'Smart Home', progress: 74 },
  { category: 'Office Equipment', progress: 68 },
  { category: 'Cables & Chargers', progress: 81 }
];

export default function ReportsPage() {
  return (
    <DashboardLayout activeNav="Reports">
      <section className={styles.page}>
        <header className={styles.hero}>
        <p className={styles.eyebrow}>Analytics</p>
        <h1 className={styles.title}>Reports</h1>
        <p className={styles.description}>
          Pantau performa bisnis dengan KPI utama, item terlaris, dan kategori dengan kontribusi
          tertinggi terhadap revenue.
        </p>
        </header>

        <section className={styles.kpiGrid}>
          {kpis.map((kpi) => (
            <article key={kpi.label} className={styles.kpiCard}>
              <p className={styles.kpiLabel}>{kpi.label}</p>
              <p className={styles.kpiValue}>{kpi.value}</p>
              <p className={`${styles.kpiDelta} ${kpi.delta.startsWith('+') ? styles.positive : styles.negative}`}>
                {kpi.delta} vs last month
              </p>
            </article>
          ))}
        </section>

        <section className={styles.panelGrid}>
          <article className={styles.panel}>
            <h2 className={styles.panelTitle}>Top Selling Items</h2>
            <p className={styles.panelSubtext}>Berdasarkan total unit terjual 30 hari terakhir</p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Units</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.sold}</td>
                    <td>{item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className={styles.panel}>
            <h2 className={styles.panelTitle}>Category Performance</h2>
            <p className={styles.panelSubtext}>Kontribusi terhadap target revenue bulanan</p>
            <div className={styles.barList}>
              {categoryPerformance.map((item) => (
                <div className={styles.barItem} key={item.category}>
                  <div className={styles.barHeader}>
                    <span>{item.category}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </DashboardLayout>
  );
}
