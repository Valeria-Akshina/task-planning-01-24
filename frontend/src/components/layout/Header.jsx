import { useState } from 'react';
import { User } from 'lucide-react';
import { getCurrentUser } from '../../lib/api';
import UserAvatar from '../common/UserAvatar';
import AuthModal from '../modals/AuthModal';
import styles from './Header.module.css';

const Header = () => {
  const user = getCurrentUser();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Search tasks..." className={styles.searchInput} />
      </div>
      
      <div className={styles.userSection}>
        {user ? (
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <UserAvatar name={user.email} size={35} />
          </div>
        ) : (
          <button className={styles.userBtn} onClick={() => setIsAuthOpen(true)}>
            <User size={20} />
          </button>
        )}
      </div>

      <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
};

export default Header;