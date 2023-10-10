import styles from '@/styles/Home.module.css';
import { useOutingsContext } from '@/providers/OutingsProvider';
import OutingList from '@/components/OutingList';

interface Props {}

export default function Home({}: Props) {
  const { rows } = useOutingsContext();

  return (
    <main className={styles.main}>
      <OutingList rows={rows.filter(row => +row.get('disabled') !== 1)} />
    </main>
  );
}
