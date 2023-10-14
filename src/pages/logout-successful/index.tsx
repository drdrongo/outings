import Link from 'next/link';
import styles from './styles.module.css';

const LogoutSuccessful = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.header}>See You Again!</h1>

      <Link href="/" className={styles.link}>
        Home
      </Link>

      <Link href="/login" className={styles.link}>
        Login
      </Link>
    </main>
  );
};

export default LogoutSuccessful;
