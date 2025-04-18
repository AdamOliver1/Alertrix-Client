import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.poweredBy}>
          Powered by <a href="https://www.tomorrow.io" target="_blank" rel="noopener noreferrer">Tomorrow.io</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 