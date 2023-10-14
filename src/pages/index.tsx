import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const Home = () => {
  return (
    <main className={styles.main}>
      <h1>Outings</h1>

      <Link href="/login">Log In</Link>
    </main>
  );
};

export default Home;
