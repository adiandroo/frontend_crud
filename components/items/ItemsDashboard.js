import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import styles from './ItemsDashboard.module.css';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All stock' },
  { value: 'healthy', label: 'Healthy stock' },
  { value: 'low', label: 'Low stock' },
  { value: 'empty', label: 'Out of stock' }
];

const SORTABLE_COLUMNS = ['nama', 'hargaBeli', 'hargaJual', 'stok'];

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

const getStockLabel = (stock) => {
  if (stock <= 0) return 'Out';
  if (stock < 5) return 'Low';
  return 'Healthy';
};

const compareValues = (aValue, bValue, direction) => {
  const parsedA = typeof aValue === 'string' ? aValue.toLowerCase() : aValue;
  const parsedB = typeof bValue === 'string' ? bValue.toLowerCase() : bValue;

  if (parsedA < parsedB) {
    return direction === 'asc' ? -1 : 1;
  }
  if (parsedA > parsedB) {
    return direction === 'asc' ? 1 : -1;
  }
  return 0;
};

export default function ItemsDashboard() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nama');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    hargaBeli: '',
    hargaJual: '',
    stok: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/items.json');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        setItems([]);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    };

    fetchItems();
  }, []);

  const processedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());

      if (stockFilter === 'all') return matchSearch;
      if (stockFilter === 'healthy') return matchSearch && item.stok >= 5;
      if (stockFilter === 'low') return matchSearch && item.stok > 0 && item.stok < 5;
      return matchSearch && item.stok <= 0;
    });

    return [...filtered].sort((a, b) => compareValues(a[sortBy], b[sortBy], sortDirection));
  }, [items, searchTerm, stockFilter, sortBy, sortDirection]);

  const totalValue = useMemo(
    () => items.reduce((acc, item) => acc + item.hargaJual * item.stok, 0),
    [items]
  );

  const handleSort = (column) => {
    if (!SORTABLE_COLUMNS.includes(column)) return;
    if (sortBy === column) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortBy(column);
    setSortDirection('asc');
  };

  const openCreateModal = () => {
    setEditingItemId(null);
    setFormError('');
    setFormData({
      nama: '',
      hargaBeli: '',
      hargaJual: '',
      stok: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItemId(item.id);
    setFormError('');
    setFormData({
      nama: item.nama,
      hargaBeli: String(item.hargaBeli),
      hargaJual: String(item.hargaJual),
      stok: String(item.stok)
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormError('');
    setIsModalOpen(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSaveItem = (event) => {
    event.preventDefault();

    const parsedItem = {
      nama: formData.nama.trim(),
      hargaBeli: Number(formData.hargaBeli),
      hargaJual: Number(formData.hargaJual),
      stok: Number(formData.stok)
    };

    if (!parsedItem.nama) {
      setFormError('Nama barang wajib diisi.');
      return;
    }

    if (parsedItem.hargaBeli < 1000 || parsedItem.hargaJual < 1000) {
      setFormError('Harga beli dan harga jual minimal Rp 1.000.');
      return;
    }

    if (parsedItem.hargaJual < parsedItem.hargaBeli) {
      setFormError('Harga jual harus lebih besar atau sama dengan harga beli.');
      return;
    }

    if (parsedItem.stok < 0) {
      setFormError('Stok tidak boleh negatif.');
      return;
    }

    if (editingItemId !== null) {
      setItems((current) =>
        current.map((item) =>
          item.id === editingItemId ? { ...item, ...parsedItem } : item
        )
      );
      closeModal();
      return;
    }

    const nextId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    setItems((current) => [
      {
        id: nextId,
        foto: '/src/image/image.jpg',
        ...parsedItem
      },
      ...current
    ]);
    closeModal();
  };

  const handleDelete = (itemId) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.pageEyebrow}>Inventory</p>
          <h1 className={styles.pageTitle}>Tabel Data Barang</h1>
          <p className={styles.pageDescription}>
            Monitor item movement, pricing quality, and stock health in one clean dashboard view.
          </p>
        </div>
        <button type="button" className={styles.ctaButton} onClick={openCreateModal}>
          Add Item
        </button>
      </header>

      <div className={styles.metrics}>
        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Total Items</p>
          <p className={styles.metricValue}>{items.length}</p>
        </article>
        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Inventory Value</p>
          <p className={styles.metricValue}>{currencyFormatter.format(totalValue)}</p>
        </article>
      </div>

      <section className={styles.tableCard}>
        <div className={styles.toolbar}>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search item name..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search item name"
          />

          <select
            className={styles.filterSelect}
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            aria-label="Filter stock status"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tableOverflow}>
          {isLoading ? (
            <TableSkeleton />
          ) : processedItems.length === 0 ? (
            <EmptyState onCreate={openCreateModal} />
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>
                    <SortButton
                      label="Harga Beli"
                      column="hargaBeli"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  <th>
                    <SortButton
                      label="Harga Jual"
                      column="hargaJual"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  <th>
                    <SortButton
                      label="Stok"
                      column="stok"
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.itemCell}>
                        <div className={styles.itemImage}>
                          <Image
                            src={item.foto || '/src/image/image.jpg'}
                            width={36}
                            height={36}
                            alt={item.nama}
                          />
                        </div>
                        <div>
                          <p className={styles.itemName}>{item.nama}</p>
                          <p className={styles.itemMeta}>ID-{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>{currencyFormatter.format(item.hargaBeli)}</td>
                    <td>{currencyFormatter.format(item.hargaJual)}</td>
                    <td>{item.stok}</td>
                    <td>
                      <span className={styles.stockBadge} data-state={getStockLabel(item.stok).toLowerCase()}>
                        {getStockLabel(item.stok)}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionCell}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => openEditModal(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className={styles.modalOverlay} role="presentation" onClick={closeModal}>
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-label={editingItemId !== null ? 'Edit item' : 'Add item'}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>{editingItemId !== null ? 'Edit Item' : 'Add Item'}</h2>
            <form className={styles.modalForm} onSubmit={handleSaveItem}>
              <label>
                Item Name
                <input
                  name="nama"
                  value={formData.nama}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Harga Beli
                <input
                  type="number"
                  min="1000"
                  step="500"
                  name="hargaBeli"
                  value={formData.hargaBeli}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Harga Jual
                <input
                  type="number"
                  min="1000"
                  step="500"
                  name="hargaJual"
                  value={formData.hargaJual}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                Stok
                <input
                  type="number"
                  min="0"
                  name="stok"
                  value={formData.stok}
                  onChange={handleFormChange}
                  required
                />
              </label>
              {formError && <p className={styles.formError}>{formError}</p>}
              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancel} onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className={styles.modalSave}>
                  {editingItemId !== null ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function SortButton({ label, column, sortBy, sortDirection, onSort }) {
  const isActive = sortBy === column;
  return (
    <button
      type="button"
      className={styles.sortButton}
      onClick={() => onSort(column)}
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      <span className={styles.sortIcon}>{isActive ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</span>
    </button>
  );
}

function TableSkeleton() {
  return (
    <div className={styles.skeletonWrap} aria-label="Loading inventory table">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className={styles.skeletonRow} key={`skeleton-${index}`}>
          <span />
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className={styles.emptyState}>
      <p className={styles.emptyTitle}>No items found</p>
      <p className={styles.emptyDescription}>
        Try adjusting search/filter criteria or add a new item to start tracking stock.
      </p>
      <button type="button" className={styles.emptyButton} onClick={onCreate}>
        Add Item
      </button>
    </div>
  );
}
