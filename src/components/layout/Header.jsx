import { Search, Bell, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import AuthModal from '../modals/AuthModal.jsx';
import { useTaskContext } from '../../context/TaskContext.jsx';
import styles from './Header.module.css';

const Header = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout } = useTaskContext();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input type="text" placeholder="Search" className={styles.searchInput} />
        </div>
        <div className={styles.actions}>
          <button className={styles.iconBtn}>
            <Bell className={styles.iconBtnSvg} />
          </button>
          <button className={styles.iconBtn}>
            <HelpCircle className={styles.iconBtnSvg} />
          </button>
          {user ? (
            <button onClick={logout} className={styles.avatar} title={`${user.name} — нажмите чтобы выйти`}>
              {user.name.slice(0, 2).toUpperCase()}
            </button>
          ) : (
            <button onClick={() => setAuthOpen(true)} className={styles.guestAvatar}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=guest" alt="avatar" className={styles.guestAvatarImg} />
            </button>
          )}
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Header;
