import styles from '@/components/Footer.module.css';
import { AddCircle, List } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface IFooter {}

const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.footer}>
      <Link href='/' className={[styles.navButton, router.pathname == "/" ? styles.active : ""].join(' ')}>
        <List
          fontSize='large'
        />
      </Link>

      <Link href='/outings/new' className={[styles.navButton, router.pathname == "/outings/new" ? styles.active : ""].join(' ')}>
        <AddCircle
          fontSize='large'
        />
      </Link>
    </div>
  );
};

export default Footer;
