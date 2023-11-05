import { ReactNode, useEffect } from 'react';
import styles from './Layout.module.css';
import Footer from './Footer';
import clsx from 'clsx';
import Head from 'next/head';
import { useOutingsContext } from '@/providers/OutingsProvider';
import { CircularProgress } from '@mui/material';
import { useAuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'next/router';
import { useLoadingContext } from '@/providers/LoadingProvider';

interface Props {
  children?: ReactNode;
  className?: string;
  title?: string;
}

export default function Layout({ children, className, title = 'Outings' }: Props) {
  const { isLoading } = useLoadingContext();

  return (
    <div className={styles.heroContainer}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Remember what you wanted to do" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={clsx(styles.contentContainer, className)}>
        {isLoading && (
          <div className={styles.loading}>
            <CircularProgress color="secondary" />
          </div>
        )}
        {children}
      </div>

      <Footer />
    </div>
  );
}
