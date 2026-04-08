import { LayoutDashboard, LogOut } from 'lucide-react';
import { getCurrentUser } from '../../lib/api';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const user = getCurrentUser();

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Pro Manage</span>
      </div>

      <nav className={styles.nav}>
        <div className={`${styles.navItem} ${styles.active}`}>
          <LayoutDashboard size={20} />
          <span>Board</span>
        </div>
      </nav>

      {user && (
        <div className={styles.bottomSection}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span>Выйти</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;