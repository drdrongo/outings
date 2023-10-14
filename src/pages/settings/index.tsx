import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from '@mui/material';
import styles from './styles.module.css';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import Layout from '@/components/Layout';

const Settings: NextPageWithLayout = () => {
  const { logout } = useAuthContext();

  return (
    <main className={styles.main}>
      <Button onClick={logout}>Sign Out</Button>;
    </main>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Settings;
