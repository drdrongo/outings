import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import styles from './styles.module.css';
import { useOutingsContext } from '@/providers/OutingsProvider';
import OutingList from '@/components/OutingList';
import Layout from '@/components/Layout';

interface Props {}

const Home: NextPageWithLayout = ({}: Props) => {
  const { rows } = useOutingsContext();

  return (
    <main className={styles.main}>
      <OutingList rows={rows.filter(row => +row.get('disabled') !== 1)} />
    </main>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
