import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { useAuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'next/router';

const Home = () => {
  const { currentUser } = useAuthContext();
  const router = useRouter();

  if (currentUser) {
    router.push('/outings');
    return;
  }

  return (
    <main className={styles.main}>
      <h1>Outings App</h1>

      <Link href="/login">Log In</Link>
    </main>
  );
};

export default Home;
