import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Layout from '@/components/Layout';
import { useOutingsContext } from '@/providers/OutingsProvider';
import { Button, CircularProgress } from '@mui/material';
import SwipeList from '@/components/SwipeList';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { useState } from 'react';

interface Props {
  // upcomingMoviesData: Movie[];
}

export default function Home({}: Props) {
  const { rows, loading, currentOuting, selectOuting } = useOutingsContext();
  function onDismiss() {
    selectOuting(null);
  }

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

        {/* <button onClick={() => setOpen(true)}>Open</button> */}
        <BottomSheet open={!!currentOuting} onDismiss={onDismiss}>
          <Button onClick={onDismiss}>Close</Button>
          {currentOuting ? (
            <div>
              <h2>{currentOuting.title}</h2>
              <p>{currentOuting.description}</p>
            </div>
          ) : (
            <div></div>
          )}
        </BottomSheet>
      </Layout>
    </>
  );
}
