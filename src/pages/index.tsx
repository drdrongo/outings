import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Layout from '@/components/Layout';
import { useOutingsContext } from '@/providers/OutingsProvider';
import Link from 'next/link';
import { AddCircle } from '@mui/icons-material';

interface Props {
  // upcomingMoviesData: Movie[];
}

export default function Home({}: Props) {
  const { rows } = useOutingsContext();
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
          <ul className={styles.list}>
            {rows.map((row) => {
              return (
                <li key={row._rowNumber} className={styles.listItem}>
                  <h3>#{row._rowNumber} - {row.title}</h3>
                  <p className={styles.description}>{row.description}</p>
                </li>
              );
            })}
          </ul>
        </main>
      </Layout>
    </>
  );
}
