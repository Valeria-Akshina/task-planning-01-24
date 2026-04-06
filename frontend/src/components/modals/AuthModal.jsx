import { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext.jsx';
import styles from './Modal.module.css';

const AuthModal = ({ open, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login, register } = useTaskContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name: name || 'User', email };
    if (isLogin) {
      login(user);
    } else {
      register(user);
    }
    setName('');
    setEmail('');
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>{isLogin ? 'Войти' : 'Регистрация'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required />
          <input type="password" placeholder="Пароль" className={styles.input} required />
          <button type="submit" className={styles.submitBtn}>{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
          <button type="button" onClick={() => setIsLogin(!isLogin)} className={styles.switchBtn}>
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
