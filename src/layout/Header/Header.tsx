import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.scss';

const Header = () => {
  const location = useLocation();
  const { pathname } = location;
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>ALERTRIX</h1>
          <nav className={styles.mainNav}>
            <ul>
              <li className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
                <Link to="/">Home</Link>
              </li>
              <li className={`${styles.navItem} ${pathname === '/alerts' ? styles.active : ''}`}>
                <Link to="/alerts">Alerts</Link>
              </li>
              <li className={`${styles.navItem} ${pathname === '/current-state' ? styles.active : ''}`}>
                <Link to="/current-state">Current State</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 