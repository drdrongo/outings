import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { useAuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import Image from 'next/image';

const Home = () => {
  const { currentUser } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/outings');
    }
  }, [currentUser]);

  return (
    <div className={styles.heroContainer}>
      <main className={styles.main}>
        <div className={styles.header}>
          <Image
            className={styles.logo}
            src="/android-chrome-192x192.png"
            alt="logo"
            width={32}
            height={32}
          />
          <h1>Outings App</h1>
        </div>

        <Link href="/login" passHref>
          <Button size="large" variant="contained">
            Log In
          </Button>
        </Link>
      </main>
    </div>
  );
};

export default Home;
