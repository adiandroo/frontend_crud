import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import styles from '../styles/SettingsPage.module.css';

export default function SettingsPage() {
  const [formValues, setFormValues] = useState({
    fullName: 'Farhan Adi',
    email: 'farhan@inventoryflow.app',
    companyName: 'Inventory Flow',
    timezone: 'Asia/Jakarta'
  });
  const [preferences, setPreferences] = useState({
    stockAlerts: true,
    weeklySummary: true,
    productUpdates: false
  });
  const [saveMessage, setSaveMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value
    }));
  };

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  const handleSave = () => {
    setSaveMessage('Settings saved successfully.');
    setTimeout(() => {
      setSaveMessage('');
    }, 2200);
  };

  return (
    <DashboardLayout activeNav="Settings">
      <section className={styles.page}>
        <header className={styles.card}>
          <p className={styles.eyebrow}>Configuration</p>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.description}>
            Atur profil akun dan preferensi notifikasi agar workflow operasional lebih konsisten.
          </p>
        </header>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Account Profile</h2>
          <p className={styles.sectionSub}>Informasi yang tampil di workspace dan laporan</p>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                value={formValues.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="companyName">Company</label>
              <input
                id="companyName"
                name="companyName"
                value={formValues.companyName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                name="timezone"
                value={formValues.timezone}
                onChange={handleInputChange}
              >
                <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                <option value="Asia/Makassar">Asia/Makassar (GMT+8)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (GMT+9)</option>
              </select>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Notification Preferences</h2>
          <p className={styles.sectionSub}>Pilih update penting yang ingin kamu terima</p>

          <div className={styles.toggleRow}>
            <div>
              <p className={styles.toggleLabel}>Low Stock Alerts</p>
              <p className={styles.toggleSub}>Notifikasi saat stok item di bawah minimum</p>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${preferences.stockAlerts ? styles.toggleOn : ''}`}
              onClick={() => togglePreference('stockAlerts')}
              aria-label="Toggle low stock alerts"
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>

          <div className={styles.toggleRow}>
            <div>
              <p className={styles.toggleLabel}>Weekly Summary</p>
              <p className={styles.toggleSub}>Ringkasan performa mingguan via email</p>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${preferences.weeklySummary ? styles.toggleOn : ''}`}
              onClick={() => togglePreference('weeklySummary')}
              aria-label="Toggle weekly summary"
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>

          <div className={styles.toggleRow}>
            <div>
              <p className={styles.toggleLabel}>Product Updates</p>
              <p className={styles.toggleSub}>Info fitur dan pembaruan product roadmap</p>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${preferences.productUpdates ? styles.toggleOn : ''}`}
              onClick={() => togglePreference('productUpdates')}
              aria-label="Toggle product updates"
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.saveButton} onClick={handleSave}>
              Save Settings
            </button>
            {saveMessage && <p className={styles.saveMessage}>{saveMessage}</p>}
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}
