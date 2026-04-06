import { LayoutDashboard, Trello, BarChart3, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Trello, label: 'Board', active: true },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Pro Manage</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button key={item.label} className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}>
            <item.icon className={styles.navIcon} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
