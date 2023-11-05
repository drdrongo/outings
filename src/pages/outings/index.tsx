import { type ReactElement, useEffect } from 'react';
import styles from './styles.module.css';
import type { NextPageWithLayout } from '@/pages/_app';
import Layout from '@/components/Layout';
import OutingList from '@/components/OutingList';
import Image from 'next/image';
import { useAuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'next/router';

const Home: NextPageWithLayout = () => {
  const { currentUser } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Image
          className={styles.logo}
          src="/android-chrome-192x192.png"
          alt="logo"
          width={32}
          height={32}
        />
        <h3>Outings</h3>
      </header>

      <OutingList />
    </main>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
