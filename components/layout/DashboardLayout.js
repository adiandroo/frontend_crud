import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './DashboardLayout.module.css';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Items', href: '/items' },
  { label: 'Reports', href: '/reports' },
  { label: 'Settings', href: '/settings' }
];

export default function DashboardLayout({ children, activeNav = 'Dashboard' }) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const searchRef = useRef(null);

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(navSearch.trim().toLowerCase())
  );
  const activeSectionLabel =
    navItems.find((item) => item.label === activeNav)?.label || 'Dashboard';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleNavSelect = (href) => {
    setIsSearchOpen(false);
    setNavSearch('');
    router.push(href);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter' && filteredNavItems.length > 0) {
      event.preventDefault();
      handleNavSelect(filteredNavItems[0].href);
    }
  };

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandDot} />
          <div>
            <p className={styles.brandName}>Inventory Flow</p>
            <p className={styles.brandMeta}>Admin Console</p>
          </div>
        </div>

        <nav className={styles.navigation}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navItem} ${activeNav === item.label ? styles.navItemActive : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className={styles.mainPanel}>
        <header className={styles.topbar}>
          <button
            type="button"
            className={styles.mobileMenuButton}
            aria-label="Open navigation menu"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={styles.topbarSearchWrap} ref={searchRef}>
            <input
              type="search"
              placeholder="Search modules..."
              className={styles.topbarSearch}
              aria-label="Search modules"
              value={navSearch}
              onChange={(event) => {
                setNavSearch(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
            />
            {isSearchOpen && navSearch.trim() !== '' && (
              <div className={styles.searchDropdown} role="listbox" aria-label="Global navigation results">
                {filteredNavItems.length === 0 ? (
                  <p className={styles.searchEmpty}>No page found</p>
                ) : (
                  filteredNavItems.map((item) => (
                    <button
                      key={`search-${item.label}`}
                      type="button"
                      className={styles.searchResult}
                      onClick={() => handleNavSelect(item.href)}
                    >
                      <span>{item.label}</span>
                      <span className={styles.searchHint}>{item.href}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div className={styles.profileMenu} ref={profileMenuRef}>
            <button
              type="button"
              className={styles.profileButton}
              aria-haspopup="menu"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              <span className={styles.profileAvatar}>FA</span>
              <span className={styles.profileName}>Farhan A.</span>
            </button>

            {isProfileOpen && (
              <div className={styles.profileDropdown} role="menu" aria-label="Profile menu">
                <p className={styles.profileDropdownLabel}>Signed in as</p>
                <p className={styles.profileDropdownEmail}>farhan@inventoryflow.app</p>
                <div className={styles.profileDivider} />
                <Link href="/settings" className={styles.profileAction} role="menuitem">
                  Account Settings
                </Link>
                <Link href="/reports" className={styles.profileAction} role="menuitem">
                  View Reports
                </Link>
                <button
                  type="button"
                  className={styles.profileAction}
                  role="menuitem"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        <div className={styles.contentWrap}>
          <section className={styles.pageHeader}>
            <div>
              <p className={styles.pageHeaderEyebrow}>Workspace</p>
              <h2 className={styles.pageHeaderTitle}>{activeSectionLabel}</h2>
            </div>
            <p className={styles.pageHeaderMeta}>
              Last sync: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </section>

          <main className={styles.content}>{children}</main>

          <footer className={styles.appFooter}>
            <p className={styles.footerCopy}>© {new Date().getFullYear()} Inventory Flow</p>
            <div className={styles.footerLinks}>
              <Link href="/reports">Reports</Link>
              <Link href="/settings">Settings</Link>
            </div>
          </footer>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className={styles.mobileMenuOverlay}
          role="presentation"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside className={styles.mobileSidebar} onClick={(event) => event.stopPropagation()}>
            <div className={styles.mobileSidebarHeader}>
              <p className={styles.mobileSidebarTitle}>Menu</p>
              <button
                type="button"
                className={styles.mobileCloseButton}
                aria-label="Close navigation menu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <nav className={styles.navigation}>
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.label}`}
                  href={item.href}
                  className={`${styles.navItem} ${activeNav === item.label ? styles.navItemActive : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
