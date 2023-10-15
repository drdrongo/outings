import styles from '@/components/Footer.module.css';
import { Add, HomeOutlined, Settings } from '@mui/icons-material';
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
        className={clsx(
          styles.navButton,
          router.pathname === '/outings' ? styles.active : ''
        )}
      >
        <HomeOutlined fontSize="large" />
      </Link>

      <Link
        href="/outings/new"
        className={clsx(
          styles.navButton,
          router.pathname === '/outings/new' ? styles.active : ''
        )}
      >
        <Add fontSize="large" />
      </Link>

      <Link
        href="/settings"
        className={clsx(
          styles.navButton,
          router.pathname === '/settings' ? styles.active : ''
        )}
      >
        <Settings fontSize="large" />
      </Link>
    </div>
  );
};

export default Footer;
