import styles from '@/components/footer.module.css';
import { AddCircle, List } from '@mui/icons-material';
import Link from 'next/link';

export interface IFooter {}

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      <Link href='/' className={styles.navButton}>
        <List />
      </Link>

      <Link href='/outings/new' className={styles.navButton}>
        <AddCircle />
      </Link>
    </div>
  );
};

export default Footer;
