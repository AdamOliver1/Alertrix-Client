import { ReactNode } from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import ErrorPopup from '../components/UI/ErrorPopup';
import SpaceBackground from '../components/Background/SpaceBackground';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.appLayout}>
      <SpaceBackground />
      <Header />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
      <ErrorPopup />
    </div>
  );
};

export default Layout;