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
          <ul>
            {rows.map((row) => {
              return (
                <li key={row._rowNumber}>
                  <p>{row._rowNumber}</p>
                  <h3>{row.title}</h3>
                  <p>{row.description}</p>
                </li>
              );
            })}
          </ul>

          <Link href='/outings/new' className={styles.addButton}>
            <AddCircle />
          </Link>
        </main>
      </Layout>
    </>
  );
}
