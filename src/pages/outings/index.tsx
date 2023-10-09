import styles from '@/styles/Home.module.css';
import { useOutingsContext } from '@/providers/OutingsProvider';
import SwipeList from '@/components/SwipeList';

interface Props {}

export default function Home({}: Props) {
  const { rows } = useOutingsContext();

  return (
    <main className={styles.main}>
      <SwipeList rows={rows.filter(row => +row.disabled !== 1)} />
    </main>
  );
}
