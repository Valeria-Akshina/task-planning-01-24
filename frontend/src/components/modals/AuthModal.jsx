import { useState } from 'react';
import { login, register } from '../../lib/api';
import styles from './Modal.module.css';

const AuthModal = ({ open, onClose = () => {} }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.token) {
          onClose();
          window.location.reload();
        } else {
          setError(result.error || 'Ошибка входа');
        }
      } else {
        const img = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        
        const registerResult = await register({
          name,
          surname,
          email,
          password,
          img,
        });
        
        if (registerResult.id_user) {
          const loginResult = await login(email, password);
          if (loginResult.token) {
            onClose();
            window.location.reload();
          }
        } else {
          setError(registerResult.error || 'Ошибка регистрации');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>{isLogin ? 'Войти' : 'Регистрация'}</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <>
              <input 
                type="text" 
                placeholder="Имя" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={styles.input} 
                required 
              />
              <input 
                type="text" 
                placeholder="Фамилия" 
                value={surname} 
                onChange={(e) => setSurname(e.target.value)} 
                className={styles.input} 
                required 
              />
            </>
          )}
          
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={styles.input} 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Пароль" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={styles.input} 
            required 
          />
          
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
          
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }} 
            className={styles.switchBtn}
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;