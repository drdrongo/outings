import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Layout from '@/components/Layout';
import { useOutingsContext } from '@/providers/OutingsProvider';
import { CircularProgress } from '@mui/material';
import SwipeList from '@/components/SwipeList';

interface Props {
  // upcomingMoviesData: Movie[];
}

export default function Home({}: Props) {
  const { rows, loading } = useOutingsContext();
  return (
    <>
      <Head>
        <title>Outings</title>
        <meta name='description' content='Remember what you wanted to do' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <main className={styles.main}>
          {loading ? (
            <div className={styles.loading}>
              <CircularProgress color='secondary' />
            </div>
          ) : (
            <SwipeList rows={rows.filter((row) => +row.disabled !== 1)} />
          )}
        </main>
      </Layout>
    </>
  );
}
