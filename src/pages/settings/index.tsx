import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from '@mui/material';
import styles from './styles.module.css';
import { useEffect, type ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

const Settings: NextPageWithLayout = () => {
  const { logout, currentUser } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h3>Settings</h3>
      </header>
      <section className={styles.contentSection}>
        <p style={{ textAlign: 'center' }}>
          You are currently logged in as: {currentUser?.email}
        </p>
        <Button onClick={logout}>Sign Out</Button>
      </section>
    </main>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Settings;
