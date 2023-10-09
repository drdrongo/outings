import styles from '@/components/Footer.module.css';
import { AccountCircleOutlined, Add, History, HomeOutlined, Search } from '@mui/icons-material';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface IFooter {}

const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.footer}>
      <Link
        href="/"
        className={clsx(styles.navButton, ['/', '/outings'].includes(router.pathname) ? styles.active : '')}
      >
        <HomeOutlined fontSize="large" />
      </Link>

      {/* <Link href="/" className={clsx(styles.navButton, router.pathname == '/outings/search' ? styles.active : '')}>
        <Search fontSize="large" />
      </Link> */}

      <Link
        href="/outings/new"
        className={clsx(styles.navButton, router.pathname == '/outings/new' ? styles.active : '')}
      >
        <Add fontSize="large" />
      </Link>
      {/* 
      <Link href="/" className={clsx(styles.navButton, router.pathname == '/outings/history' ? styles.active : '')}>
        <History fontSize="large" />
      </Link> */}

      {/* <Link href="/" className={clsx(styles.navButton, router.pathname == '/outings/profile' ? styles.active : '')}>
        <AccountCircleOutlined fontSize="large" />
      </Link> */}
    </div>
  );
};

export default Footer;
